package com.demoapp.demo.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
@DisplayName("POST /auth/reset-password")
class AuthControllerResetPasswordTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  @Test
  @DisplayName("Aceita a solicitação quando o e-mail está cadastrado")
  void aceitaSolicitacaoDeEmailCadastrado() throws Exception {
    User usuario = new User();
    usuario.setEmail("aluno@fag.edu.br");
    usuario.setPassword("Senha@123");
    userRepository.save(usuario);

    mockMvc.perform(post("/auth/reset-password")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"aluno@fag.edu.br\"}"))
        .andExpect(status().isOk());
  }

  @Test
  @DisplayName("Informa que o usuário não foi encontrado quando o e-mail não está cadastrado")
  void informaQueOUsuarioNaoFoiEncontrado() throws Exception {
    mockMvc.perform(post("/auth/reset-password")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"desconhecido@fag.edu.br\"}"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("Usuário não encontrado"));
  }
}
