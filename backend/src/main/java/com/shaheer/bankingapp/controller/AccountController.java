package com.shaheer.bankingapp.controller;

import com.shaheer.bankingapp.dto.AmountRequest;
import com.shaheer.bankingapp.dto.BalanceResponse;
import com.shaheer.bankingapp.dto.TransactionResponse;
import com.shaheer.bankingapp.dto.TransferRequest;
import com.shaheer.bankingapp.model.TransactionType;
import com.shaheer.bankingapp.service.AccountOperationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/accounts")
@AllArgsConstructor
public class AccountController {

    private final AccountOperationService accountOperationService;

    @PostMapping("/deposit")
    public ResponseEntity<BalanceResponse> deposit(@Valid @RequestBody AmountRequest request) {
        return ResponseEntity.ok(accountOperationService.deposit(request.getAccountNumber(), request.getAmount()));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<BalanceResponse> withdraw(@Valid @RequestBody AmountRequest request) {
        return ResponseEntity.ok(accountOperationService.withdraw(request.getAccountNumber(), request.getAmount()));
    }

    @PostMapping("/transfer")
    public ResponseEntity<BalanceResponse> transfer(@Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(accountOperationService.transfer(
                request.getFromAccountNumber(),
                request.getToAccountNumber(),
                request.getAmount()));
    }

    @GetMapping("/{accountNumber}/balance")
    public ResponseEntity<BalanceResponse> getBalance(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountOperationService.getBalance(accountNumber));
    }

    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<Page<TransactionResponse>> getTransactionHistory(
            @PathVariable String accountNumber,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity
                .ok(accountOperationService.getTransactionHistory(accountNumber, type, from, to, page, size));
    }
}
