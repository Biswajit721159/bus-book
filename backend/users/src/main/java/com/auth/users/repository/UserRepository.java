package com.auth.users.repository;

import com.auth.users.entities.User;
import com.auth.users.enums.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);

    long countByRole(Role role);

    long countByIsBlocked(boolean isBlocked);

    long countByIsEmailVerified(boolean isEmailVerified);
}
