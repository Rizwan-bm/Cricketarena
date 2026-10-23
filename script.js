// Cricket Arena — interactive front-end demo. All scores and auction data are sample data.
const matches = [...document.querySelectorAll('.match-card')];
const tabs = [...document.querySelectorAll('.match-tab')];
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(item => item.classList.toggle('active', item === tab));
  const filter = tab.dataset.filter;
  matches.forEach(card => {
    card.classList.toggle('hidden', filter !== 'all' && card.dataset.status !== filter);
  });
}));

document.querySelectorAll('.details-btn').forEach(button => {
  button.addEventListener('click', () => showToast(`${button.dataset.match}: sample match information for this demo.`));
});

const players = [
  { name: 'Arjun Perera', initials: 'AP', role: 'ALL-ROUNDER', country: 'SRI LANKA', description: 'Dynamic middle-order batter with reliable pace bowling.', base: 2.0, step: 0.5 },
  { name: 'Kavindu Silva', initials: 'KS', role: 'BATTER', country: 'SRI LANKA', description: 'Aggressive top-order batter who loves to take on the powerplay.', base: 1.5, step: 0.25 },
  { name: 'Rohan Sharma', initials: 'RS', role: 'FAST BOWLER', country: 'INDIA', description: 'Express pace and pinpoint yorkers make him a death-over specialist.', base: 2.5, step: 0.5 },
  { name: 'Dilan Fernando', initials: 'DF', role: 'WICKETKEEPER', country: 'SRI LANKA', description: 'Quick hands behind the stumps and a fearless finisher with the bat.', base: 1.0, step: 0.25 },
  { name: 'Ayaan Khan', initials: 'AK', role: 'SPIN BOWLER', country: 'PAKISTAN', description: 'Clever variation and control through the middle overs.', base: 1.75, step: 0.25 },
  { name: 'Milan Jayasuriya', initials: 'MJ', role: 'BATTER', country: 'SRI LANKA', description: 'A composed stroke-maker with the ability to accelerate late in the innings.', base: 1.25, step: 0.25 }
];
let playerIndex = 0;
let soldPlayers = 0;
let currentPrice = players[0].base;
let highestTeam = '';
let sold = false;
const el = id => document.getElementById(id);
const money = value => `LKR ${Number.isInteger(value) ? value.toFixed(1) : value.toFixed(2).replace(/0$/, '')}M`;

function renderPlayer() {
  const player = players[playerIndex];
  currentPrice = player.base;
  highestTeam = '';
  sold = false;
  el('playerName').textContent = player.name;
  el('playerNumber').textContent = String(playerIndex + 1).padStart(2, '0');
  el('playerAvatar').querySelector('span').textContent = player.initials;
  el('playerRole').textContent = player.role;
  el('playerCountry').textContent = player.country;
  el('playerDescription').textContent = player.description;
  el('basePrice').textContent = money(player.base);
  el('currentBid').textContent = money(currentPrice);
  el('nextBid').textContent = money(currentPrice + player.step);
  el('bidMessage').textContent = 'Waiting for the opening bid…';
  el('bidButton').disabled = false;
  el('bidButton').textContent = 'Place Bid ↗';
  el('nextPlayerBtn').disabled = false;
  el('remainingCount').textContent = players.length - soldPlayers;
}

el('bidButton').addEventListener('click', () => {
  if (sold) return;
  const player = players[playerIndex];
  const team = el('teamSelect').value;
  currentPrice = Number((currentPrice + player.step).toFixed(2));
  highestTeam = team;
  el('currentBid').textContent = money(currentPrice);
  el('nextBid').textContent = money(currentPrice + player.step);
  el('bidMessage').textContent = `${team} leads at ${money(currentPrice)}!`;
  showToast(`${team} bids ${money(currentPrice)} for ${player.name}`);
});

el('nextPlayerBtn').addEventListener('click', () => {
  if (!sold) {
    if (highestTeam) {
      sold = true;
      soldPlayers++;
      el('soldCount').textContent = soldPlayers;
      el('remainingCount').textContent = players.length - soldPlayers;
      el('bidMessage').textContent = `${players[playerIndex].name} sold to ${highestTeam} for ${money(currentPrice)}.`;
      el('bidButton').disabled = true;
      el('bidButton').textContent = 'Player Sold ✓';
      showToast(`${players[playerIndex].name} sold to ${highestTeam}!`);
      return;
    }
    showToast('Place at least one bid before moving to the next player.');
    return;
  }
  if (playerIndex >= players.length - 1) {
    el('bidMessage').textContent = 'Auction complete! All players have been presented.';
    el('nextPlayerBtn').disabled = true;
    el('bidButton').disabled = true;
    showToast('Auction demo completed.');
    return;
  }
  playerIndex++;
  renderPlayer();
});

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

renderPlayer();
