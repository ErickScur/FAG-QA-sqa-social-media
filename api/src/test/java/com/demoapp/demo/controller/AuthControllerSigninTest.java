package com.demoapp.demo.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("POST /auth/signin")
class AuthControllerSigninTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  @BeforeEach
  void cadastraUsuario() {
    User usuario = new User();
    usuario.setEmail("aluno@fag.edu.br");
    usuario.setPassword("Senha@123");
    userRepository.save(usuario);
  }

  @Test
  @DisplayName("Autentica o usuário quando e-mail e senha estão corretos")
  void autenticaComCredenciaisCorretas() throws Exception {
    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"aluno@fag.edu.br\",\"password\":\"Senha@123\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.email").value("aluno@fag.edu.br"));
  }

  @Test
  @DisplayName("Responde credenciais inválidas quando a senha está errada")
  void respondeCredenciaisInvalidasComSenhaErrada() throws Exception {
    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"aluno@fag.edu.br\",\"password\":\"Outra@456\"}"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
  }

  @Test
  @DisplayName("Responde credenciais inválidas quando a senha digitada é qualquer texto errado")
  void respondeCredenciaisInvalidasComSenhaEmFormatoQualquer() throws Exception {
    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"aluno@fag.edu.br\",\"password\":\"senhaerrada\"}"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
  }
}
