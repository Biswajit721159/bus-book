package com.auth.users.services;

import com.auth.users.dtos.masterlist.RequestDTO;
import com.auth.users.dtos.masterlist.ResponseDTO;
import com.auth.users.entities.MasterList;
import com.auth.users.entities.User;
import com.auth.users.exceptions.ConflictException;
import com.auth.users.exceptions.ResourceNotFoundException;
import com.auth.users.exceptions.UnauthorizedException;
import com.auth.users.repository.MasterListRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class MasterListService {

    @Autowired
    private MasterListRepository masterListRepository;

    public List<ResponseDTO> getMasterList(User currentUser) {
        log.info("Fetching master list for user: {}", currentUser.getEmail());
        List<MasterList> list = masterListRepository.findByCreatedByAndActiveTrue(currentUser.getId());
        return list.stream().map(ResponseDTO::new).toList();
    }

    @Transactional
    public ResponseDTO addMasterListRecord(RequestDTO body, User currentUser) {
        log.info("Adding master list record '{}' for user: {}", body.getName(), currentUser.getEmail());
        if (masterListRepository.existsByNameAndCreatedByAndActiveTrue(body.getName(), currentUser.getId())) {
            throw new ConflictException("A master list record with this name already exists");
        }

        MasterList newRecord = new MasterList();
        newRecord.setName(body.getName());
        newRecord.setCreatedBy(currentUser.getId());
        newRecord.setActive(true);

        MasterList savedRecord = masterListRepository.save(newRecord);
        return new ResponseDTO(savedRecord);
    }

    @Transactional
    public void updateMasterListRecord(Long id, RequestDTO body, User currentUser) {
        log.info("Updating master list record ID: {} to '{}' for user: {}", id, body.getName(), currentUser.getEmail());
        MasterList existingRecord = masterListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));

        if (!existingRecord.getCreatedBy().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized to update this record");
        }

        if (masterListRepository.existsByNameAndCreatedByAndActiveTrueAndIdNot(body.getName(), currentUser.getId(), id)) {
            throw new ConflictException("A master list record with this name already exists");
        }

        existingRecord.setName(body.getName());
        masterListRepository.save(existingRecord);
    }

    @Transactional
    public void deleteMasterListRecord(Long id, User currentUser) {
        log.info("Soft-deleting master list record ID: {} for user: {}", id, currentUser.getEmail());
        MasterList existingRecord = masterListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));

        if (!existingRecord.getCreatedBy().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized to delete this record");
        }

        existingRecord.setActive(false);
        masterListRepository.save(existingRecord);
    }
}
