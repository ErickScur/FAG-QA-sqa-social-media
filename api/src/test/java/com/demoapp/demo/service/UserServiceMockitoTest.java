package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService com repositório mockado")
class UserServiceMockitoTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  @Test
  @DisplayName("Salva o usuário com o e-mail e a senha informados")
  void salvaUsuarioComOsDadosInformados() {
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    User criado = userService.createUser("aluno@fag.edu.br", "Senha@123");

    ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
    verify(userRepository).save(captor.capture());

    assertEquals("aluno@fag.edu.br", captor.getValue().getEmail());
    assertEquals("Senha@123", captor.getValue().getPassword());
    assertEquals("aluno@fag.edu.br", criado.getEmail());
  }

  @Test
  @DisplayName("Devolve o usuário encontrado pelo repositório")
  void devolveUsuarioQuandoEmailExiste() {
    User existente = new User();
    existente.setId(7L);
    existente.setEmail("aluno@fag.edu.br");
    when(userRepository.findByEmail("aluno@fag.edu.br")).thenReturn(Optional.of(existente));

    User encontrado = userService.findByEmail("aluno@fag.edu.br");

    assertEquals(7L, encontrado.getId());
    assertEquals("aluno@fag.edu.br", encontrado.getEmail());
  }

  @Test
  @DisplayName("Devolve nulo quando o e-mail não está cadastrado")
  void devolveNuloQuandoEmailNaoExiste() {
    when(userRepository.findByEmail("desconhecido@fag.edu.br")).thenReturn(Optional.empty());

    assertNull(userService.findByEmail("desconhecido@fag.edu.br"));
  }
}
