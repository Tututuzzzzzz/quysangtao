package com.leadsgen.quysangtao.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {
    @NotBlank
    private String usernameOrEmail;

    @NotBlank
    private String password;
}
