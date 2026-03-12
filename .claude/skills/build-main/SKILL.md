---
name: build-main
description: Commit all pending changes and push to master. Use when the user wants to deploy or push the current state of the project to the main branch.
disable-model-invocation: true
allowed-tools: Bash, Read, Glob, Grep
---

## Estado actual del repositorio

- Branch: !`git branch --show-current`
- Cambios pendientes: !`git status --short`
- Último commit: !`git log --oneline -1`

## Instrucciones

Vas a hacer commit de todos los cambios pendientes y pushear a master. Sigue estos pasos en orden:

1. **Verifica el branch actual** — si no estás en `master`, avisa al usuario antes de continuar y pide confirmación.

2. **Revisa los cambios** — corre `git status` y `git diff --stat` para entender qué cambió.

3. **Redacta el mensaje de commit** — analiza los archivos modificados y escribe un mensaje conciso en formato:
   ```
   <tipo>: <descripción corta en español
   ```
   Tipos válidos: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`

   Si el usuario pasó un mensaje con `$ARGUMENTS`, úsalo como base o como el mensaje completo.

4. **Stagea los archivos** — usa `git add` con archivos específicos (nunca `git add -A` ni `git add .` a ciegas). Excluye siempre: `.env`, `.env.local`, `*.key`, `*.pem`, archivos con credenciales.

5. **Crea el commit** — con el mensaje redactado en el paso 3, usando HEREDOC:
   ```bash
   git commit -m "$(cat <<'EOF'
   <mensaje>

   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```

6. **Push a master** — corre `git push origin master`.

7. **Confirma el resultado** — muestra el output del push y el link al commit si está disponible.

> Si hay archivos en conflicto o el push falla por divergencia, NO uses `--force`. Informa al usuario y pide instrucciones.

ARGUMENTS: $ARGUMENTS
