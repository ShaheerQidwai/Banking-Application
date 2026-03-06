package com.shaheer.bankingapp.exception;

public class AuthenticationFailedException extends BankingException {
    public AuthenticationFailedException() {
        super("Invalid CNIC or password");
    }
}
