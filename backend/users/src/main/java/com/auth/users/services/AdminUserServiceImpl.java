package com.auth.users.services;

import com.auth.users.appExceptions.BadRequestException;
import com.auth.users.appExceptions.ResourceNotFoundException;
import com.auth.users.dtos.user.*;
import com.auth.users.entities.User;
import com.auth.users.enums.Role;
import com.auth.users.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public PaginatedUsersResponseDTO getUsersPaged(AdminUserQueryDTO query) {
        int page = Math.max(1, query.getPage());
        int limit = query.getLimit() <= 0 ? 10 : query.getLimit();

        Specification<User> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by Role
            if (query.getRole() != null) {
                predicates.add(cb.equal(root.get("role"), query.getRole()));
            }

            // Filter by Blocked status
            if (query.getIsBlocked() != null) {
                predicates.add(cb.equal(root.get("isBlocked"), query.getIsBlocked()));
            }

            // Combined search across name, email, phone, and company
            if (query.getSearch() != null && !query.getSearch().trim().isEmpty()) {
                String searchPattern = "%" + query.getSearch().trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), searchPattern);
                Predicate emailMatch = cb.like(cb.lower(root.get("email")), searchPattern);
                Predicate phoneMatch = cb.like(cb.lower(cb.coalesce(root.get("phoneNumber"), "")), searchPattern);
                Predicate companyMatch = cb.like(cb.lower(cb.coalesce(root.get("companyName"), "")), searchPattern);
                predicates.add(cb.or(nameMatch, emailMatch, phoneMatch, companyMatch));
            }

            // Legacy specific name filter
            if (query.getName() != null && !query.getName().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + query.getName().trim().toLowerCase() + "%"));
            }

            // Legacy specific email filter
            if (query.getEmail() != null && !query.getEmail().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + query.getEmail().trim().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> pageResult = userRepository.findAll(spec, pageable);

        List<AdminUserResponseDTO> mappedUsers = pageResult.getContent().stream().map(this::mapToDTO).toList();

        return PaginatedUsersResponseDTO.builder().totalPage(Math.max(1, pageResult.getTotalPages())).totalCount(pageResult
                .getTotalElements()).currentPage(page).result(mappedUsers).build();
    }

    @Override
    @Transactional
    public AdminUserResponseDTO toggleBlock(Long userId, Long adminUserId) {
        if (userId.equals(adminUserId)) {
            throw new BadRequestException("Super Admin cannot block their own account");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        boolean newBlockedStatus = !user.isBlocked();
        user.setBlocked(newBlockedStatus);
        userRepository.save(user);

        log.info("User {} (ID: {}) block status toggled to {}", user.getEmail(), userId, newBlockedStatus);
        return mapToDTO(user);
    }

    @Override
    @Transactional
    public AdminUserResponseDTO updateUser(Long userId, AdminUpdateUserDTO body) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (body.getName() != null && !body.getName().trim().isEmpty()) {
            user.setName(body.getName().trim());
        }

        if (body.getPhoneNumber() != null) {
            user.setPhoneNumber(body.getPhoneNumber().trim());
        }

        if (body.getCompanyName() != null) {
            user.setCompanyName(body.getCompanyName().trim());
        }

        if (body.getRole() != null) {
            user.setRole(body.getRole());
        }

        if (body.getIsBlocked() != null) {
            user.setBlocked(body.getIsBlocked());
        }

        if (body.getIsEmailVerified() != null) {
            user.setEmailVerified(body.getIsEmailVerified());
        }

        userRepository.save(user);
        log.info("User {} (ID: {}) updated by super admin", user.getEmail(), userId);
        return mapToDTO(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId, Long adminUserId) {
        if (userId.equals(adminUserId)) {
            throw new BadRequestException("Super Admin cannot delete their own account");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        userRepository.delete(user);
        log.info("User {} (ID: {}) permanently deleted by super admin", user.getEmail(), userId);
    }

    @Override
    @Transactional(readOnly = true)
    public UserStatsDTO getUserStats() {
        long total = userRepository.count();
        long normal = userRepository.countByRole(Role.NORMAL_USER);
        long busOwners = userRepository.countByRole(Role.BUS_OWNER);
        long superAdmins = userRepository.countByRole(Role.SUPER_ADMIN);
        long blocked = userRepository.countByIsBlocked(true);
        long verified = userRepository.countByIsEmailVerified(true);

        return UserStatsDTO.builder().totalUsers(total).normalUsers(normal).busOwners(busOwners).superAdmins(superAdmins).blockedUsers(
                blocked).verifiedUsers(verified).build();
    }

    private AdminUserResponseDTO mapToDTO(User user) {
        return AdminUserResponseDTO.builder().id(user.getId()).name(user.getName()).email(user.getEmail()).role(user.getRole()).isBlocked(
                user.isBlocked()).isEmailVerified(user.isEmailVerified()).phoneNumber(user.getPhoneNumber()).companyName(user
                        .getCompanyName()).createdAt(user.getCreatedAt()).updatedAt(user.getUpdatedAt()).build();
    }
}
