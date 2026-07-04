#!/usr/bin/env bash
# ============================================================
# check-vps-security.sh — audit rapide du hardening du VPS.
# À exécuter SUR le VPS :  bash scripts/check-vps-security.sh
# ============================================================
set -u

PASS=0
FAIL=0

ok()   { echo "  ✅ $1"; PASS=$((PASS+1)); }
ko()   { echo "  ❌ $1"; FAIL=$((FAIL+1)); }

echo "== SSH =="
if sudo sshd -T 2>/dev/null | grep -qi "^passwordauthentication no"; then
  ok "PasswordAuthentication désactivé"
else
  ko "PasswordAuthentication encore actif !"
fi
if sudo sshd -T 2>/dev/null | grep -qiE "^permitrootlogin (no|prohibit-password)"; then
  ok "Login root désactivé"
else
  ko "PermitRootLogin trop permissif !"
fi

echo "== UFW =="
if sudo ufw status | grep -q "Status: active"; then
  ok "UFW actif"
  EXTRA=$(sudo ufw status | grep ALLOW | grep -vE "(22|80|443)[/ ]" || true)
  if [ -z "$EXTRA" ]; then
    ok "Seuls 22/80/443 ouverts"
  else
    ko "Ports supplémentaires ouverts : $EXTRA"
  fi
else
  ko "UFW inactif !"
fi

echo "== fail2ban =="
if systemctl is-active --quiet fail2ban; then
  ok "fail2ban actif ($(sudo fail2ban-client status sshd 2>/dev/null | grep 'Currently banned' | awk '{print $NF}') IP bannies sur sshd)"
else
  ko "fail2ban inactif !"
fi

echo "== Docker : ports exposés =="
EXPOSED=$(docker ps --format '{{.Names}} {{.Ports}}' | grep "0.0.0.0" | grep -vE ":(80|443)->" || true)
if [ -z "$EXPOSED" ]; then
  ok "Aucun conteneur n'expose de port direct (hors NPM 80/443)"
else
  ko "Conteneurs exposés directement : $EXPOSED"
fi

echo "== Secrets =="
if [ -f ~/projects/lumia/.env ]; then
  PERM=$(stat -c "%a" ~/projects/lumia/.env)
  [ "$PERM" = "600" ] && ok ".env en 600" || ko ".env en $PERM (attendu 600)"
fi
if git -C ~/projects/lumia ls-files --error-unmatch .env >/dev/null 2>&1; then
  ko ".env est TRACKÉ par git !"
else
  ok ".env non commité"
fi

echo
echo "Résultat : $PASS OK / $FAIL KO"
[ "$FAIL" -eq 0 ] && echo "🎉 Hardening conforme" || echo "⚠️  Corriger les points KO (voir docs/deployment/vps-security.md)"
exit "$FAIL"
