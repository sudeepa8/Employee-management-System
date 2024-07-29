package com.usersdemo.usersdemo.service;

import com.usersdemo.usersdemo.entity.OurUsers;
import com.usersdemo.usersdemo.entity.PasswordResetToken;
import com.usersdemo.usersdemo.repository.PasswordResetTokenRepository;
import com.usersdemo.usersdemo.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public void sendPasswordResetToken(String email) {
        try {
            Optional<OurUsers> user = usersRepo.findByEmail(email);
            if (user.isEmpty()) {
                System.out.println("User not found with email: " + email);
                throw new RuntimeException("User not found with email: " + email);
            }

            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken(token, user.get(), LocalDateTime.now().plusMinutes(30));
            passwordResetTokenRepository.save(resetToken);

            String resetUrl = "http://localhost:8084/reset-password?email=%s" + token;
            emailService.sendEmail(email, "Password Reset Request", "To reset your password, click the link below:\n" + resetUrl);
            System.out.println("Password reset token sent to: " + email + " with token: " + token);

        } catch (Exception e) {
            String errorMessage = "Error occurred while sending password reset token to: " + email;
            System.err.println(errorMessage);
            e.printStackTrace();  // Log the exception details
            throw new RuntimeException(errorMessage, e);
        }
    }


    public boolean validatePasswordResetToken(String token) {
        Optional<PasswordResetToken> resetToken = passwordResetTokenRepository.findByToken(token);
        if (resetToken.isEmpty() || resetToken.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }
        return true;
    }

    public boolean updatePassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetToken = passwordResetTokenRepository.findByToken(token);
        if (resetToken.isEmpty() || resetToken.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        OurUsers user = resetToken.get().getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepo.save(user);
        passwordResetTokenRepository.delete(resetToken.get());  // Invalidate the token after successful reset
        return true;
    }


}
