package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("Regras de e-mail do cadastro")
class UserServiceEmailTest {

  private final UserService userService = new UserService(null);

  @Test
  @DisplayName("Aceita e-mail em formato válido")
  void aceitaEmailValido() {
    assertTrue(userService.isEmailValid("aluno@fag.edu.br"));
  }

  @Test
  @DisplayName("Recusa e-mail sem arroba")
  void recusaEmailSemArroba() {
    assertFalse(userService.isEmailValid("alunofag.edu.br"));
  }

  @Test
  @DisplayName("Recusa e-mail sem domínio depois do arroba")
  void recusaEmailSemDominio() {
    assertFalse(userService.isEmailValid("aluno@"));
  }

  @Test
  @DisplayName("Recusa e-mail sem nada antes do arroba")
  void recusaEmailSemParteLocal() {
    assertFalse(userService.isEmailValid("@fag.edu.br"));
  }
}
