package org.main.claimstreams.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.main.claimstreams.models.enums.UserRole;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Setter
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Policy> policies = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InsuranceClaim> claims = new ArrayList<>();

    public User(String email,
                String password,
                String fullName,
                UserRole role
    ) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
    }

    public void addClaim(InsuranceClaim claim) {
        claims.add(claim);
        claim.setUser(this);
    }

    public void addPolicy(Policy policy) {
        policies.add(policy);
        policy.setUser(this);
    }
}
