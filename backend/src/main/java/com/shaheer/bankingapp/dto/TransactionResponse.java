package com.shaheer.bankingapp.dto;

import com.shaheer.bankingapp.model.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private String transactionId;
    private TransactionType type;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    private String fromAccountNumber;
    private String toAccountNumber;
    private String description;
}
