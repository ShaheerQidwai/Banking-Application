package com.shaheer.bankingapp.dto;

import com.shaheer.bankingapp.model.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private String accountNumber;
    private String fullName;
    private String cnic;
    private String phone;
    private AccountType accountType;
    private BigDecimal balance;
    private boolean active;
    private LocalDateTime createdAt;
}
