package com.auth.users.services;

import com.auth.users.appExceptions.ConflictException;
import com.auth.users.appExceptions.ResourceNotFoundException;
import com.auth.users.appExceptions.UnauthorizedException;
import com.auth.users.dtos.masterlistDTOs.RequestDTO;
import com.auth.users.dtos.masterlistDTOs.ResponseDTO;
import com.auth.users.entities.MasterList;
import com.auth.users.entities.User;
import com.auth.users.repository.MasterListRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MasterListService {

    private final MasterListRepository masterListRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "masterList", key = "#currentUser.id")
    public List<ResponseDTO> getMasterList(User currentUser) {
        log.info("Fetching master list for user ID: {}", currentUser.getId());
        List<MasterList> list = masterListRepository.findByCreatedByAndActiveTrue(currentUser.getId());
        return list.stream().map(ResponseDTO::new).toList();
    }

    @Transactional
    @CacheEvict(value = "masterList", key = "#currentUser.id")
    public ResponseDTO addMasterListRecord(RequestDTO body, User currentUser) {
        String trimmedName = body.getName().trim();
        log.info("Adding master list record '{}' for user ID: {}", trimmedName, currentUser.getId());
        if (masterListRepository.existsByNameAndCreatedByAndActiveTrue(trimmedName, currentUser.getId())) {
            throw new ConflictException("A master list record with this name already exists");
        }

        MasterList newRecord = new MasterList();
        newRecord.setName(trimmedName);
        newRecord.setCreatedBy(currentUser.getId());
        newRecord.setActive(true);

        MasterList savedRecord = masterListRepository.save(newRecord);
        return new ResponseDTO(savedRecord);
    }

    @Transactional
    @CacheEvict(value = "masterList", key = "#currentUser.id")
    public void updateMasterListRecord(Long id, RequestDTO body, User currentUser) {
        String trimmedName = body.getName().trim();
        log.info("Updating master list record ID: {} to '{}' for user ID: {}", id, trimmedName, currentUser.getId());
        MasterList existingRecord = masterListRepository.findByIdAndActiveTrue(id).orElseThrow(() -> new ResourceNotFoundException(
                "Master list record not found with id: " + id));

        if (!existingRecord.getCreatedBy().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized: Cannot update another user's master list record");
        }

        if (masterListRepository.existsByNameAndCreatedByAndActiveTrueAndIdNot(trimmedName, currentUser.getId(), id)) {
            throw new ConflictException("A master list record with this name already exists");
        }

        existingRecord.setName(trimmedName);
        masterListRepository.save(existingRecord);
    }

    @Transactional
    @CacheEvict(value = "masterList", key = "#currentUser.id")
    public void deleteMasterListRecord(Long id, User currentUser) {
        log.info("Soft-deleting master list record ID: {} for user ID: {}", id, currentUser.getId());
        MasterList existingRecord = masterListRepository.findByIdAndActiveTrue(id).orElseThrow(() -> new ResourceNotFoundException(
                "Master list record not found with id: " + id));

        if (!existingRecord.getCreatedBy().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized: Cannot delete another user's master list record");
        }

        existingRecord.setActive(false);
        masterListRepository.save(existingRecord);
    }

    @Transactional(readOnly = true)
    public List<ResponseDTO> getMasterListByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return masterListRepository.findByIdInAndActiveTrue(ids).stream().map(ResponseDTO::new).toList();
    }
}
