package com.shaheer.bankingapp.controller;

import com.shaheer.bankingapp.dto.AccountResponse;
import com.shaheer.bankingapp.dto.CreateAccountRequest;
import com.shaheer.bankingapp.dto.LoginRequest;
import com.shaheer.bankingapp.dto.LoginResponse;
import com.shaheer.bankingapp.service.UserManagementService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserManagementService userManagementService;

    @PostMapping("/accounts")
    public ResponseEntity<AccountResponse> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userManagementService.createAccount(request));
    }

    @GetMapping("/accounts/{accountNumber}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable String accountNumber) {
        return ResponseEntity.ok(userManagementService.getAccountByNumber(accountNumber));
    }

    @DeleteMapping("/accounts/{accountNumber}")
    public ResponseEntity<Void> deleteAccount(@PathVariable String accountNumber) {
        userManagementService.deleteAccount(accountNumber);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userManagementService.login(request));
    }
}
