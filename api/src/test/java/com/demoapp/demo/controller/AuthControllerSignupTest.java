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
@DisplayName("POST /auth/signup")
class AuthControllerSignupTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  @Test
  @DisplayName("Cria a conta e devolve os dados do usuário quando o cadastro é válido")
  void criaContaComDadosValidos() throws Exception {
    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"novo@fag.edu.br\",\"password\":\"Senha@123\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.email").value("novo@fag.edu.br"));
  }

  @Test
  @DisplayName("Recusa o cadastro quando a senha não atende aos critérios")
  void recusaCadastroComSenhaFraca() throws Exception {
    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"novo@fag.edu.br\",\"password\":\"123456\"}"))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.message").value("Senha inválida"));
  }

  @Test
  @DisplayName("Recusa o cadastro quando o e-mail já existe na base")
  void recusaCadastroComEmailRepetido() throws Exception {
    User existente = new User();
    existente.setEmail("repetido@fag.edu.br");
    existente.setPassword("Senha@123");
    userRepository.save(existente);

    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"repetido@fag.edu.br\",\"password\":\"Senha@123\"}"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").exists());
  }

  @Test
  @DisplayName("Aceita senha que usa cerquilha como caractere especial")
  void aceitaSenhaComCerquilha() throws Exception {
    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"cerquilha@fag.edu.br\",\"password\":\"Senha#123\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("cerquilha@fag.edu.br"));
  }
}
