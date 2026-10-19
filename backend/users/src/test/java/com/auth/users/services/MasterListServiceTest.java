package com.auth.users.services;

import com.auth.users.appExceptions.ConflictException;
import com.auth.users.appExceptions.ResourceNotFoundException;
import com.auth.users.appExceptions.UnauthorizedException;
import com.auth.users.dtos.masterlistDTOs.RequestDTO;
import com.auth.users.dtos.masterlistDTOs.ResponseDTO;
import com.auth.users.entities.MasterList;
import com.auth.users.entities.User;
import com.auth.users.enums.Role;
import com.auth.users.repository.MasterListRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MasterListServiceTest {

    @Mock
    private MasterListRepository masterListRepository;

    @InjectMocks
    private MasterListService masterListService;

    private User testUser;
    private MasterList testRecord;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).name("John Doe").email("john@example.com").role(Role.NORMAL_USER).build();

        testRecord = MasterList.builder().id(100L).name("Jane Doe").createdBy(1L).active(true).build();
    }

    @Test
    @DisplayName("getMasterList should return active records for user")
    void getMasterList_Success() {
        when(masterListRepository.findByCreatedByAndActiveTrue(1L))
                .thenReturn(List.of(testRecord));

        List<ResponseDTO> result = masterListService.getMasterList(testUser);

        assertEquals(1, result.size());
        assertEquals("Jane Doe", result.get(0).getName());
        verify(masterListRepository).findByCreatedByAndActiveTrue(1L);
    }

    @Test
    @DisplayName("addMasterListRecord should save and return new record")
    void addMasterListRecord_Success() {
        RequestDTO request = new RequestDTO();
        request.setName("Alice Smith");

        when(masterListRepository.existsByNameAndCreatedByAndActiveTrue("Alice Smith", 1L)).thenReturn(false);
        when(masterListRepository.save(any(MasterList.class))).thenAnswer(inv -> {
            MasterList m = inv.getArgument(0);
            m.setId(101L);
            return m;
        });

        ResponseDTO response = masterListService.addMasterListRecord(request, testUser);

        assertNotNull(response);
        assertEquals("Alice Smith", response.getName());
        verify(masterListRepository).save(any(MasterList.class));
    }

    @Test
    @DisplayName("addMasterListRecord should throw ConflictException if duplicate active name exists")
    void addMasterListRecord_Duplicate_ThrowsConflict() {
        RequestDTO request = new RequestDTO();
        request.setName("Jane Doe");

        when(masterListRepository.existsByNameAndCreatedByAndActiveTrue("Jane Doe", 1L)).thenReturn(true);

        assertThrows(ConflictException.class, () -> masterListService.addMasterListRecord(request, testUser));
        verify(masterListRepository, never()).save(any());
    }

    @Test
    @DisplayName("updateMasterListRecord should successfully update name")
    void updateMasterListRecord_Success() {
        RequestDTO request = new RequestDTO();
        request.setName("Jane Updated");

        when(masterListRepository.findByIdAndActiveTrue(100L)).thenReturn(Optional.of(testRecord));
        when(masterListRepository.existsByNameAndCreatedByAndActiveTrueAndIdNot("Jane Updated", 1L, 100L)).thenReturn(false);

        masterListService.updateMasterListRecord(100L, request, testUser);

        assertEquals("Jane Updated", testRecord.getName());
        verify(masterListRepository).save(testRecord);
    }

    @Test
    @DisplayName("updateMasterListRecord should throw UnauthorizedException if owned by another user")
    void updateMasterListRecord_DifferentOwner_ThrowsUnauthorized() {
        RequestDTO request = new RequestDTO();
        request.setName("Jane Updated");

        testRecord.setCreatedBy(999L);
        when(masterListRepository.findByIdAndActiveTrue(100L)).thenReturn(Optional.of(testRecord));

        assertThrows(UnauthorizedException.class, () -> masterListService.updateMasterListRecord(100L, request, testUser));
        verify(masterListRepository, never()).save(any());
    }

    @Test
    @DisplayName("updateMasterListRecord should throw ResourceNotFoundException if record not found or inactive")
    void updateMasterListRecord_NotFound_ThrowsException() {
        RequestDTO request = new RequestDTO();
        request.setName("Jane Updated");

        when(masterListRepository.findByIdAndActiveTrue(100L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> masterListService.updateMasterListRecord(100L, request, testUser));
    }

    @Test
    @DisplayName("deleteMasterListRecord should soft delete active record")
    void deleteMasterListRecord_Success() {
        when(masterListRepository.findByIdAndActiveTrue(100L))
                .thenReturn(Optional.of(testRecord));

        masterListService.deleteMasterListRecord(100L, testUser);

        assertFalse(testRecord.isActive());
        verify(masterListRepository).save(testRecord);
    }

    @Test
    @DisplayName("getMasterListByIds should only return active records")
    void getMasterListByIds_OnlyActiveRecords() {
        when(masterListRepository.findByIdInAndActiveTrue(List.of(100L, 102L)))
                .thenReturn(List.of(testRecord));

        List<ResponseDTO> results = masterListService.getMasterListByIds(List.of(100L, 102L));

        assertEquals(1, results.size());
        assertEquals("Jane Doe", results.get(0).getName());
    }
}
