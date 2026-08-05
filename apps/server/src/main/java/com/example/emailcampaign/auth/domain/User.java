package com.example.emailcampaign.auth.domain;

import com.example.emailcampaign.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String passwordHash;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(255) default 'LOCAL'")
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column
    private String providerId;

    @Column
    private String avatarUrl;

    public User(String email, String passwordHash, String fullName) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.provider = AuthProvider.LOCAL;
    }

    public User(String email, String fullName, AuthProvider provider, String providerId, String avatarUrl) {
        this.email = email;
        this.fullName = fullName;
        this.provider = provider;
        this.providerId = providerId;
        this.avatarUrl = avatarUrl;
    }
}
