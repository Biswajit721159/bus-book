package com.auth.users.repository;

import com.auth.users.entities.MasterList;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MasterListRepository extends JpaRepository<MasterList, Long> {
    List<MasterList> findByCreatedByAndActiveTrue(Long createdBy);

    java.util.Optional<MasterList> findByIdAndActiveTrue(Long id);

    List<MasterList> findByIdInAndActiveTrue(List<Long> ids);

    boolean existsByNameAndCreatedByAndActiveTrue(String name, Long createdBy);

    boolean existsByNameAndCreatedByAndActiveTrueAndIdNot(String name, Long createdBy, Long id);
}
