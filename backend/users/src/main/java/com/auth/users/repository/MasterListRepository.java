package com.auth.users.repository;


import com.auth.users.entities.MasterList;
import com.auth.users.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasterListRepository extends JpaRepository<MasterList, Long> {
    List<MasterList> findByCreatedByAndIsActiveTrue(User createdBy);
    boolean existsByNameAndCreatedByAndIsActiveTrue(String name, User createdBy);
    boolean existsByNameAndCreatedByAndIsActiveTrueAndIdNot(String name, User createdBy, Long id);
}
