import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8701521409:AAGSj1eWEk_QLIH7eMUKzxxXn5LK0ED38oY';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const DEFAULT_CHAT_ID = '8873925517';

// File path to store registered subscriber chat IDs
const DATA_DIR = path.join(__dirname, '../../data');
const CHATS_FILE = path.join(DATA_DIR, 'telegram_subscribers.json');

export class TelegramService {
  private static subscribers: Set<string | number> = new Set();
  private static lastUpdateId = 0;
  private static pollTimer: NodeJS.Timeout | null = null;

  /**
   * Initialize subscriber list and start polling for /start messages
   */
  static async init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(CHATS_FILE)) {
        const raw = fs.readFileSync(CHATS_FILE, 'utf-8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          list.forEach((id) => this.subscribers.add(id));
        }
      }

      // Add default chat_id from env or fallback
      const envChatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;
      if (envChatId) {
        envChatId.split(',').forEach((id) => {
          const trimmed = id.trim();
          if (trimmed) this.subscribers.add(trimmed);
        });
      }

      console.log(`🤖 Telegram Bot Service ready. Loaded ${this.subscribers.size} subscribers.`);

      // Check updates immediately and start interval
      await this.pollUpdates();
      this.pollTimer = setInterval(() => this.pollUpdates(), 4000);
    } catch (err) {
      console.error('Failed to initialize Telegram service:', err);
    }
  }

  private static saveSubscribers() {
    try {
      fs.writeFileSync(CHATS_FILE, JSON.stringify(Array.from(this.subscribers), null, 2));
    } catch (err) {
      console.error('Failed to save telegram subscribers:', err);
    }
  }

  /**
   * Poll Telegram getUpdates to automatically capture users who pressed /start
   */
  static async pollUpdates() {
    try {
      const url = `${TELEGRAM_API}/getUpdates?offset=${this.lastUpdateId + 1}&timeout=3`;
      const res = await fetch(url);
      const data: any = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          this.lastUpdateId = Math.max(this.lastUpdateId, update.update_id);

          const msg = update.message || update.channel_post;
          if (msg && msg.chat && msg.chat.id) {
            const chatId = msg.chat.id;
            const text = (msg.text || '').trim();

            if (!this.subscribers.has(chatId)) {
              this.subscribers.add(chatId);
              this.saveSubscribers();
              console.log(`✅ New Telegram subscriber registered: ${chatId} (${msg.from?.first_name || 'User'})`);

              // Send welcome confirmation
              await this.sendMessageToChat(
                chatId,
                `👋 <b>Assalomu alaykum, ${msg.from?.first_name || 'Hurmatli rahbar'}!</b>\n\n` +
                `Siz <b>ZAVERO</b> rasmiy bildirishnoma botiga muvaffaqiyatli ulandingiz! 🚀\n\n` +
                `Endi veb-saytingizdan (<b>zavero.uz</b>) mijozlar "Bog'lanish" formasini to'ldirganda, barcha arizalar (ism, telefon raqam, cafe nomi) shu yerga soniyasida yetib keladi. ✅`
              );
            } else if (text === '/start' || text.startsWith('/start')) {
              await this.sendMessageToChat(
                chatId,
                `👋 <b>Zavero boti faol!</b>\n\nYangi mijozlar arizasi shu yerga avtomatik kelishda davom etmoqda. 📲`
              );
            }
          }
        }
      }
    } catch (err) {
      // Silently ignore network retry errors
    }
  }

  /**
   * Send a formatted HTML message to a specific chat
   */
  static async sendMessageToChat(chatId: string | number, htmlText: string): Promise<boolean> {
    try {
      const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: htmlText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
      const result: any = await response.json();
      if (!result.ok) {
        console.error(`❌ Telegram send error to ${chatId}:`, result);
      } else {
        console.log(`✅ Telegram alert sent successfully to ${chatId} (msg_id: ${result.result?.message_id})`);
      }
      return result.ok === true;
    } catch (err) {
      console.error(`Failed to send telegram msg to ${chatId}:`, err);
      return false;
    }
  }

  /**
   * Broadcast a new Lead to all registered chat IDs
   */
  static async sendNewLeadAlert(lead: {
    name: string;
    phone: string;
    businessName: string;
    city: string;
    plan?: string | null;
    message?: string | null;
    createdAt?: Date | string;
  }) {
    // If no subscribers registered yet, try one immediate poll in case user just pressed /start
    if (this.subscribers.size === 0) {
      await this.pollUpdates();
    }

    // Ensure default chat ID is always included
    const envChatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;
    if (envChatId) {
      envChatId.split(',').forEach((id) => {
        const trimmed = id.trim();
        if (trimmed) this.subscribers.add(trimmed);
      });
    }

    const cleanPhone = lead.phone.replace(/[^\d+]/g, '');
    const dateFormatted = new Date().toLocaleString('uz-UZ', {
      timeZone: 'Asia/Tashkent',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const text =
      `🔥 <b>YANGI MIJOZ ARIZASI (ZAVERO.UZ)</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>Mijoz ismi:</b> ${lead.name}\n` +
      `📞 <b>Telefon raqami:</b> <a href="tel:${cleanPhone}">${lead.phone}</a>\n` +
      `🏪 <b>Cafe / Restoran:</b> ${lead.businessName}\n` +
      `📍 <b>Shahar:</b> ${lead.city}\n` +
      (lead.plan ? `🏷 <b>Tanlangan Tarif:</b> <b>${lead.plan}</b>\n` : '') +
      (lead.message ? `💬 <b>Qo'shimcha izoh:</b> <i>${lead.message}</i>\n` : '') +
      `⏰ <b>Kelgan vaqti:</b> ${dateFormatted}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `⚡️ <i>Mijoz bilan darhol bog'laning!</i>`;

    console.log(`📢 Sending lead alert to ${this.subscribers.size} telegram subscribers...`);

    let sentCount = 0;
    for (const chatId of this.subscribers) {
      const ok = await this.sendMessageToChat(chatId, text);
      if (ok) sentCount++;
    }

    return { sent: sentCount, total: this.subscribers.size };
  }
}
