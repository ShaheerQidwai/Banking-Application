package com.shaheer.bankingapp.dto;

import com.shaheer.bankingapp.model.AccountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccountRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String cnic;

    @NotBlank
    private String phone;

    @NotBlank
    private String password;

    @NotNull
    private AccountType accountType;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal initialBalance;
}
