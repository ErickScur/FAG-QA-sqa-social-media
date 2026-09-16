package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("PostService com repositório mockado")
class PostServiceMockitoTest {

  @Mock
  private UserPostReactionRepository reactionRepository;

  @InjectMocks
  private PostService postService;

  @Test
  @DisplayName("Registra a curtida quando o usuário ainda não curtiu o post")
  void registraCurtidaQuandoNaoExisteReacao() {
    when(reactionRepository.findByUserIdAndPostId(1L, 10L)).thenReturn(Optional.empty());

    Map<String, Object> resultado = postService.toggleLike(10L, 1L);

    ArgumentCaptor<UserPostReaction> captor = ArgumentCaptor.forClass(UserPostReaction.class);
    verify(reactionRepository).save(captor.capture());
    verify(reactionRepository, never()).delete(any(UserPostReaction.class));

    assertEquals(1L, captor.getValue().getUserId());
    assertEquals(10L, captor.getValue().getPostId());
    assertEquals(true, resultado.get("liked"));
    assertEquals(10L, resultado.get("postId"));
  }

  @Test
  @DisplayName("Remove a curtida quando o usuário curte o mesmo post de novo")
  void removeCurtidaQuandoJaExisteReacao() {
    UserPostReaction reacaoExistente = new UserPostReaction();
    reacaoExistente.setId(3L);
    reacaoExistente.setUserId(1L);
    reacaoExistente.setPostId(10L);
    when(reactionRepository.findByUserIdAndPostId(1L, 10L)).thenReturn(Optional.of(reacaoExistente));

    Map<String, Object> resultado = postService.toggleLike(10L, 1L);

    verify(reactionRepository).delete(reacaoExistente);
    verify(reactionRepository, never()).save(any(UserPostReaction.class));

    assertEquals(false, resultado.get("liked"));
  }

  @Test
  @DisplayName("Devolve lista vazia quando o usuário não curtiu nenhum post")
  void devolveListaVaziaQuandoNaoHaCurtidas() {
    when(reactionRepository.findByUserId(1L)).thenReturn(Collections.emptyList());

    Map<String, Object> resultado = postService.getLikedPosts(1L, null, null);

    assertEquals(0, resultado.get("total"));
    assertTrue(((List<?>) resultado.get("posts")).isEmpty());
  }
}
