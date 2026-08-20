package org.main.claimstreams.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.main.claimstreams.models.enums.UserRole;

import java.util.ArrayList;

@Entity
@Table(name = "users")
@NoArgsConstructor
@Getter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

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

    @Setter
    @ManyToOne
    @JoinColumn(name = "policies_policy_number")
    private Policy policies;

    @Setter
    @ManyToOne
    @JoinColumn(name = "claims_claim_id")
    private InsuranceClaim claims;

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
}
