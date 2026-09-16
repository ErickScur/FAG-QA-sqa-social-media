package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("Regras de senha do cadastro")
class UserServiceSenhaTest {

  private final UserService userService = new UserService(null);

  @Test
  @DisplayName("Aceita senha que atende a todos os critérios exigidos")
  void aceitaSenhaQueAtendeTodosOsCriterios() {
    assertTrue(userService.isPasswordValid("Senha@123"));
  }

  @Test
  @DisplayName("Recusa senha com menos de 8 caracteres")
  void recusaSenhaCurta() {
    assertFalse(userService.isPasswordValid("Ab@1"));
  }

  @Test
  @DisplayName("Recusa senha sem letra maiúscula")
  void recusaSenhaSemLetraMaiuscula() {
    assertFalse(userService.isPasswordValid("senha@123"));
  }

  @Test
  @DisplayName("Recusa senha sem número")
  void recusaSenhaSemNumero() {
    assertFalse(userService.isPasswordValid("Senha@senha"));
  }

  @Test
  @DisplayName("Recusa senha sem caractere especial")
  void recusaSenhaSemCaractereEspecial() {
    assertFalse(userService.isPasswordValid("Senha1234"));
  }

  @Test
  @DisplayName("Aceita cerquilha como caractere especial")
  void aceitaCerquilhaComoCaractereEspecial() {
    assertTrue(userService.isPasswordValid("Senha#123"));
  }

  @Test
  @DisplayName("Aceita underline, hífen e circunflexo como caractere especial")
  void aceitaOutrosCaracteresEspeciais() {
    assertTrue(userService.isPasswordValid("Senha_123"));
    assertTrue(userService.isPasswordValid("Senha-123"));
    assertTrue(userService.isPasswordValid("Senha^123"));
  }
}
