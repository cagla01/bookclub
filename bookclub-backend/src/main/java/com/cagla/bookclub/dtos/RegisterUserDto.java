package com.cagla.bookclub.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserDto {
	private String email;
    private String password;
    private String fullName;
}
