package com.example.emailcampaign.auth.repository;

import com.example.emailcampaign.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.emailCredits = u.emailCredits - :amount WHERE u.id = :userId AND u.emailCredits >= :amount")
    int deductCredits(@Param("userId") UUID userId, @Param("amount") long amount);

    @Modifying
    @Query("UPDATE User u SET u.emailCredits = u.emailCredits + :amount WHERE u.id = :userId")
    int addCredits(@Param("userId") UUID userId, @Param("amount") long amount);

    @Query("SELECT u.emailCredits FROM User u WHERE u.id = :userId")
    Long findEmailCreditsById(@Param("userId") UUID userId);
}
