package com.auth.users.controllers;

import com.auth.users.dtos.common.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.auth.users.dtos.masterlist.RequestDTO;
import com.auth.users.dtos.masterlist.ResponseDTO;
import com.auth.users.entities.User;
import com.auth.users.services.MasterListService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/master-list")
@Tag(name = "This end point is for add, edit, delete from master list")
public class MasterListController {

    @Autowired
    private MasterListService masterListService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<ResponseDTO>>> getUser(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<ResponseDTO> responseList = masterListService.getMasterList(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Master list fetched successfully", responseList, HttpStatus.OK.value()));
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<ResponseDTO>> addUser(@Valid @RequestBody RequestDTO body, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        System.out.println(authentication);
        ResponseDTO newRecord = masterListService.addMasterListRecord(body, currentUser);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User added to master list successfully", newRecord, HttpStatus.CREATED.value()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody RequestDTO body,
            Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        masterListService.updateMasterListRecord(id, body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Record updated successfully", null, HttpStatus.OK.value()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        masterListService.deleteMasterListRecord(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Record soft-deleted successfully", null, HttpStatus.OK.value()));
    }
}
