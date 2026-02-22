package com.bugtracker.controller;

import com.bugtracker.entity.*;
import com.bugtracker.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @PostMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'MANAGER', 'ADMIN')")
    public Issue createIssue(
            @RequestBody Issue issue,
            @RequestParam Long projectId,
            @RequestParam Long userId
    ) {
        return issueService.createIssue(issue, projectId, userId);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DEVELOPER', 'TESTER', 'MANAGER', 'ADMIN')")
    public List<Issue> getAllIssues() {
        return issueService.getAllIssues();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TESTER', 'MANAGER', 'ADMIN')")
    public Issue updateStatus(
            @PathVariable Long id,
            @RequestParam IssueStatus status
    ) {
        return issueService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public void deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
    }
}
