const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    try { tg.setHeaderColor('#1A73E8'); } catch(e) {}
    try { tg.setBackgroundColor('#F8FAFF'); } catch(e) {}
  }

  const SUPPORTED_LANGUAGES = {
      'uz': { name: "O'zbekcha", flag: '🇺🇿' },
      'ru': { name: 'Русский', flag: '🇷🇺' },
      'kk': { name: 'Қазақша', flag: '🇰🇿' },
      'ky': { name: 'Кыргызча', flag: '🇰🇬' },
      'kaa': { name: 'Qaraqalpaqsha', flag: '🇺🇿' },
      'tg': { name: 'Тоҷикӣ', flag: '🇹🇯' },
      'en': { name: 'English', flag: '🇬🇧' },
  };

  let userId = null;
  let userName = '';
  let userFirstName = '';
  let __sessionId = null; // UNIQUE per page load for guest isolation
  let currentLang = 'uz';

  function getSessionId() {
    if (!__sessionId) {
      __sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    }
    return __sessionId;
  }

  if (tg?.initDataUnsafe?.user?.id) {
    userId = tg.initDataUnsafe.user.id;
    userName = tg.initDataUnsafe.user.username || '';
    userFirstName = tg.initDataUnsafe.user.first_name || '';
    // Detect language from Telegram user settings
    const tgLang = tg.initDataUnsafe.user.language_code;
    if (tgLang) {
      // Map Telegram language codes to our supported languages
      const langMap = {
        'uz': 'uz', 'ru': 'ru', 'kk': 'kk', 'ky': 'ky',
        'kaa': 'kaa', 'tg': 'tg', 'en': 'en'
      };
      // Check for exact match first
      if (langMap[tgLang]) {
        currentLang = langMap[tgLang];
      } else {
        // Check prefix (e.g., 'ru-RU' -> 'ru')
        const prefix = tgLang.split('-')[0];
        if (langMap[prefix]) {
          currentLang = langMap[prefix];
        }
      }
      localStorage.setItem('app_language', currentLang);
    }
  } else if (tg?.initData) {
    const params = new URLSearchParams(tg.initData);
    const userJson = params.get('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        userId = user.id;
        userName = user.username || '';
        userFirstName = user.first_name || '';
        // Detect language from initData user object
        const tgLang = user.language_code;
        if (tgLang) {
          const langMap = {
            'uz': 'uz', 'ru': 'ru', 'kk': 'kk', 'ky': 'ky',
            'kaa': 'kaa', 'tg': 'tg', 'en': 'en'
          };
          if (langMap[tgLang]) {
            currentLang = langMap[tgLang];
          } else {
            const prefix = tgLang.split('-')[0];
            if (langMap[prefix]) {
              currentLang = langMap[prefix];
            }
          }
          localStorage.setItem('app_language', currentLang);
        }
      } catch (e) {}
    }
  }

  // Web App tarjimalari
  const WEBAPP_T = {
      'uz': {
          'select_language': '🌍 Tilni tanlang',
          'language_changed': '✅ Til o\'zgartirildi: {lang}',
          'close': 'Yopish',
          'change_language': 'Tilni o\'zgartirish',
          'fill_profile': 'Anketa to\'ldirish',
          'about_yourself': 'O\'zingiz haqingizda ma\'lumot bering',
          'gender': 'Jins',
          'male': 'Erkak',
          'female': 'Ayol',
          'select_gender': 'Jinsni tanlang',
          'main_info': 'Asosiy ma\'lumotlar',
          'your_name': 'Ismingiz',
          'your_age': 'Yoshingiz',
          'city_district': 'Shahar / Tuman',
          'about_short': 'O\'zingiz haqingizda qisqacha',
          'your_zodiac': 'Burjingiz',
          'select_zodiac': 'Burjni tanlang',
          'zodiac_hint': 'Yaxshi moslik uchun burjingizni belgilang.',
          'interests': 'Qiziqishlar',
          'your_goal': 'Maqsadingiz',
          'photo': 'Fotosurat',
          'upload_photo': 'Rasm yuklash',
          'photo_format': 'PNG, JPG • max 5MB',
          'photo_hint': 'Rasm yuklangandan so\'ng saqlash mumkin.',
          'save_profile': 'Anketani saqlash',
          'search': 'Qidirish',
          'find_friends': 'Yangi do\'stlar toping',
          'search_by_name': 'Ism bo\'yicha',
          'advanced_filters': '🔍 Kengaytirilgan filtrlar',
          'close_filters': '❌ Filtrni yopish',
          'age_from': 'Dan',
          'age_to': 'Gacha',
          'zodiac_search': '⭐ Burj bo\'yicha qidirish',
          'select_zodiac_search': 'Burj tanlang',
          'zodiac_filter_hint': 'Qidiruvda burj bo\'yicha filtr qo\'llang.',
          'all_zodiacs': 'Barcha burjlar',
          'only_my_zodiac': 'Faqat burjimga mos odamlarni ko\'rsat',
          'chats': 'Muloqot',
          'likes_and_chats': 'Like lar va suhbatingiz',
          'liked_you': '💖 Sizga Like bosganlar',
          'conversations': '💬 Muloqotlar',
          'no_chats': 'Hali suhbatingiz yo\'q',
          'no_chats_hint': 'Qidirish bo\'limidan yangi do\'stlar toping va like bosing!',
          'my_profile': 'Mening anketam',
          'profile_info': 'Profilingiz ma\'lumotlari',
          'loading': 'Yuklanmoqda...',
          'edit_profile': 'Anketani tahrirlash',
          'send_message': '💬 Xabar yuborish',
          'write_first_message': 'Foydalanuvchiga birinchi xabaringizni yozing.',
          'send': '📨 Xabar yuborish',
          'daily_limits': '📊 Kunlik limitlar:',
          'likes_limit': '• Like: 25 ta',
          'messages_limit': '• Xabar yuborish: 10 ta',
          'super_likes_limit': '• Super Like: 10 ta',
          'increase_limits': '🎁 Limitni oshirish:',
          'invite_5': '• Guruhga 5 ta odam qo\'shing → 1 hafta limitsiz',
          'invite_10': '• Guruhga 10 ta odam qo\'shing → 1 oy limitsiz',
          'join_group': '👥 Guruhga qo\'shilish',
          'tomorrow': 'Ertaga davom etish',
          'join_group_title': 'Guruhga qo\'shiling',
          'join_group_desc': 'Do\'stlaringizni guruhga taklif qiling va limitsiz foydalanish imkoniyatiga ega bo\'ling!',
          'rewards': '🎁 Mukofotlar:',
          'reward_5': '• 5 ta do\'st → 1 hafta limitsiz',
          'reward_10': '• 10 ta do\'st → 1 oy limitsiz',
          'copy': 'Nusxa',
          'share_telegram': 'Telegramda ulashish',
          'super_like_sticker': '⭐ Super Like — Sticker yuborish',
          'cancel': 'Bekor qilish',
          'no_one_found': 'Hech kim topilmadi',
          'no_one_hint': 'Hozircha sizga mos foydalanuvchilar yo\'q. Keyinroq qayta urinib ko\'ring.',
          'all_viewed': 'Hammasi ko\'rildi!',
          'all_viewed_hint': 'Siz barcha nomzodlarni ko\'rib chiqdingiz. Qayta qidiring.',
          'search_again': '🔍 Qayta qidirish',
          'match_subtitle': 'Endi muloqot boshlashingiz mumkin',
          'match_btn': 'Ajoyib!',
          'search_results_title': 'Qidiruv natijalari',
          'limit_exceeded_title': 'Kunlik limit tugadi',
          'limit_exceeded_desc': 'Sizning kunlik limitingiz tugadi.',
          'photo_viewer_photo': 'Foto',
          'chat_image_btn': 'Rasm yuborish',
          'chat_input_placeholder': 'Xabar yozing...',
          'name_placeholder': 'To\'liq ismingiz',
          'age_placeholder': 'Masalan: 22',
          'city_placeholder': 'Yashash joyingiz',
          'about_placeholder': 'Kim bo\'lishni xohlaysiz...',
          'zodiac_select_btn': 'Burj tanlang...',
          'age': 'Yoshi',
          'goal': 'Maqsad',
          'city_label': 'Shahar',
          'city_search_placeholder': 'Shahar yoki tuman',
          'gender_filter_hint': "Jins bo'yicha filtr",
          'name_search_placeholder': 'Ism kiriting...',
          'nav_chat': 'Chat',
          'nav_profile': 'Profil',
          'message_placeholder': 'Salom! Qalaysiz?...',
          'app_title': "Do'stlik & Tanishuv",
          'close_filters': '❌ Filtrni yopish',
          'lang_uz': "O'zbekcha",
          'lang_ru': 'Русский',
          'lang_kk': 'Қазақша',
          'lang_ky': 'Кыргызча',
          'lang_kaa': 'Qaraqalpaqsha',
          'lang_tg': 'Тоҷикӣ',
          'lang_en': 'English',
          'chat_user_default': 'Foydalanuvchi',
          'goal_dostlik': "Do'stlik",
          'goal_tanishuv': 'Tanishuv',
          'goal_oila': 'Oila',
          'goal_sevgi': 'Sevgi',
          'goal_romantika': 'Romantika',
          'goal_uchrashuv': 'Uchrashuv',
          'goal_virtual': 'Virtual muloqot',
          'goal_boshqa': 'Boshqa',
          'int_kino': '🍿 Kino',
          'int_musiqa': '🎵 Musiqa',
          'int_kitob': "📚 Kitob o'qish",
          'int_oyinlar': "🎮 O'yinlar",
          'int_teatr': '🎭 Teatr',
          'int_muzey': '🏛️ Muzeylar',
          'int_sanat': "🎨 San'at",
          'int_foto': '📸 Foto',
          'int_sheeriyat': "📜 She'riyat",
          'int_raqs': '💃 Raqs',
          'int_sport': '⚽ Sport',
          'int_yoga': '🧘‍♂️ Yoga',
          'int_sayr': '🚶‍♂️ Sayr',
          'int_tennis': '🏓 Stol tennisi',
          'int_sayohat': '✈️ Sayohat',
          'int_plyaj': '🏖️ Plyaj',
          'int_shopping': '🛍️ Shopping',
          'int_moda': '👗 Moda',
          'int_qahva': '☕ Qahva',
          'int_vino': '🍷 Vino',
          'int_pivo': '🍺 Pivo',
          'int_blog': '✍️ Blog yuritish',
          'int_dasturlash': '💻 Dasturlash',
          'int_shaxmat': '♟️ Shaxmat',
          'int_rasm': '🎨 Rasm chizish',
          'int_tillar': "🗣️ Tillar o'rganish",
          'limit_likes_exceeded': 'Sizning kunlik like limitingiz tugadi. Guruhga odam qo\'shib, limitni oshiring!',
          'limit_messages_exceeded': 'Sizning kunlik xabar yuborish limitingiz tugadi. Guruhga odam qo\'shib, limitni oshiring!',
          'limit_super_likes_exceeded': 'Sizning kunlik Super Like limitingiz tugadi. Guruhga odam qo\'shib, limitni oshiring!',
          'limit_exceeded_default': 'Kunlik limitingiz tugadi. Guruhga odam qo\'shib, limitni oshiring!',
          'referral_invite_text': 'Tanishuv guruhiga qo\'shiling! Yangi do\'stlarни toping.',
          'referral_invited_count': 'Guruhga taklif qilinganlar',
          'referral_unlimited_until': 'Limitsiz davr',
          'referral_recent_invitees': 'So\'nggi taklif qilinganlar', 'referral_recent_invited': 'So\'ngi taklif qilinganlar',
          'count_pcs': 'ta',
          'count_active_label': 'ta faollik',
          'count_likes_label': 'ta like',
          'count_super_label': 'ta super like',
          'count_score_label': 'ball',
          'top_label': 'TOP',
          'no_name': 'Ismsiz',
          'write_message_to': '{name} ga birinchi xabaringizni yozing.',
          'enter_message_text': 'Xabar matnini kiriting!',
          'error_user_id_not_found': 'Xatolik: sizning foydalanuvchi identifikatoringiz topilmadi.',
          'error_recipient_not_found': 'Xatolik: qabul qiluvchi topilmadi. Iltimos, qayta urinib ko\'ring.',
          'message_sent': '💬 Xabar yuborildi!',
          'like_sent_with_hint': '💙 Like yuborildi! Agar u ham sizni yoqtirsa, match bo\'lib suhbat ochiladi.',
          'super_like_sent_hint': '⭐ {sticker} Super Like yuborildi! U qabul qilsa, suhbat ochiladi.',
          'like_not_sent': 'Like yuborilmadi',
          'max_interests_hint': 'Maksimal 5 ta qiziqish tanlash mumkin.',
          'zodiac_not_set': 'Burjingiz aniqlanmadi',
          'zodiac_not_set_hint': '"Faqat burjimga mos odamlarni ko\'rsat" funksiyasi ishlamasi uchun avval anketangizda burjingizni to\'g\'ri tanlang.',
          'searching': 'Qidirilmoqda...',
          'login_via_telegram': 'Telegram orqali kiring',
          'open_in_telegram': 'Qidirish uchun botni Telegram ilovasida oching.',
          'server_error': 'Server bilan aloqa yo\'q',
          'check_internet': 'Internet aloqasini tekshiring yoki keyinroq urinib ko\'ring.',
          'retry_btn': 'Qayta urinish',
          'cannot_connect': 'Ulana olmadi',
          'compat_good': 'Mos burj',
          'compat_difficult': 'Murakkab',
          'btn_back': 'Orqaga',
          'btn_skip': 'O\'tkazib yuborish',
          'btn_dislike': 'Yoqmadi',
          'send_message_btn': 'Xabar yuborish',
          'cannot_go_back': 'Orqaga qaytish mumkin emas',
          'previous_candidate': '⬅️ Oldingi nomzod',
          'user_id_not_found': 'Foydalanuvchi ID topilmadi',
          'generic_error': 'Xatolik',
          'match_super_like': '🎉 Match! {sticker} Super Like yuborildi!',
          'super_like_sent': '⭐ {sticker} Super Like yuborildi!',
          'user_not_identified': 'Foydalanuvchi aniqlanmadi',
          'telegram_id_not_found': 'Telegram ID topilmadi. Web Appni Telegram ichida oching yoki qayta kirib ko\'ring.',
          'no_likes_yet': 'Hozircha like yo\'q',
          'no_likes_hint': 'Sizga hali hech kim like yubormagan.',
          'people_who_liked_you': 'Sizga like yuborganlar',
          'years_old': 'yosh',
          'accept': 'Qabul',
          'reject': 'Rad etish',
          'you_rejected': 'Siz {name} ni rad qildingiz.',
          'error_retry': 'Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.',
          'age_label': 'Yosh',
          'loc_select_country': '— Tanlang —',
          'loc_select_region': '— Viloyatni tanlang —',
          'loc_select_district': '— Tumanni tanlang —',
          'loc_all_countries': '— Barcha davlatlar —',
          'loc_all_regions': '— Barcha viloyatlar —',
          'loc_all_districts': '— Barcha tumanlar —',
          'no_city': 'Shahar ko\'rsatilmagan',
          'message': 'Xabar',
          'block': 'Blok',
          'match_with': '{name} bilan match bo\'ldingiz!',
          'fill_profile_first': 'Avval profilingizni to\'ldiring',
          'like_sent': '💙 Like yuborildi!',
          'unknown_error': 'Noma\'lum',
          'blocked': '🚫 Bloklandi',
          'default_about': 'Bu foydalanuvchi o\'z maqsadi va qiziqishlarini ko\'rsatib ketgan.',
          'about_me': 'Men haqimda',
          'goals_label': 'Maqsadlar',
          'not_specified': 'Ko\'rsatilmagan',
          'interests_label': 'Qiziqishlar',
          'max_interests_display': 'Maksimal 5 ta qiziqish ko\'rsatiladi.',
          'open_chat': 'Suhbatni ochish...',
          'your_photo': 'Siz yuborgan rasm',
          'partner_photo': 'Suhbatdosh rasmi',
          'click_to_view': 'To\'liq ko\'rinishda ochish',
          'profile_not_loaded': 'Profilingiz yuklanmadi',
          'profile_not_found': 'Anketa topilmadi',
          'please_fill_profile': 'Iltimos, avval anketa to\'ldiring.',
          'upload_valid_photo': 'Avval to\'g\'ri rasm yuklang va tekshirilgan bo\'lsin.',
          'select_gender_prompt': 'Jinsni tanlang!',
          'enter_name_prompt': 'Ismingizni kiriting!',
          'enter_age_prompt': 'Yoshingizni to\'g\'ri kiriting! (16-80)',
          'enter_city_prompt': 'Shahar/tuman kiriting!',
          'select_goal_prompt': 'Kamida 1 ta maqsad tanlang!',
          'profile_saved_success': 'Anketa muvaffaqiyatli saqlandi!',
          'profile_saved_local': 'Anketa mahalliy saqlandi.',
          'images_only': 'Faqat rasm fayllari qabul qilinadi.',
          'image_too_large': 'Rasm 5MB dan katta!',
          'checking_image': '📸 Rasm tekshirilmoqda, iltimos kuting…',
          'face_detected': '🧠 Yuz aniqlangan. Rasm yuklanmoqda…',
          'checking_image_short': 'Rasm tekshirilmoqda, biroz kuting...',
          'no_person_in_image': 'Rasmda inson topilmadi. Iltimos, o\'zingizni ko\'rsatadigan rasm tanlang.',
          'image_check_error': 'Rasm tekshirishda xatolik. Internet aloqasini tekshiring va qayta urinib ko\'ring.',
          'uploading_image': '📸 Rasm yuklanmoqda…',
          'image_uploaded_success': '✅ Rasm yuklandi. Endi anketa saqlashingiz mumkin.',
          'image_read_error': '❌ Rasm o\'qilishda xatolik yuz berdi.',
          'image_load_failed': 'Rasm yuklanmadi',
          'image_ready': '✅ Rasm yuklangan. Anketa saqlash mumkin.',
          'person_confirmed_uploading': '🧍 Rasmda inson borligi tasdiqlandi. Yuklanmoqda…',
          'photo_not_sent_but_saved': 'Rasm telegramga yuborilmadi, lekin anketangiz saqlandi.',
          'data_too_long': 'Xatolik: ma\'lumot juda uzun.',
          'script_load_failed': 'Yuklanmadi: {src}',
          'wait_timeout': '{name} kutish vaqti tugadi',
          'link_copied': 'Link nusxalandi!',
          'error_occurred': 'Xatolik yuz berdi.',
          'please_retry': 'Qayta urinib ko\'ring.',
          'error_prefix': 'Xatolik: ',
          'images_only_error': '❌ Faqat rasm fayllari qabul qilinadi.',
          'image_size_error': '❌ Rasm 5MB dan katta.',
          'no_person_error': '❌ Rasmda inson topilmadi. Yana urining.',
          'check_error_inet': '❌ Tekshiruvda xatolik. Internet aloqasini tekshiring.',
          'zod_qoy': "Qo'y", 'zod_buzoq': 'Buzoq', 'zod_egizak': 'Egizak',
          'zod_qisqichbaqa': 'Qisqichbaqa', 'zod_arslon': 'Arslon',
          'zod_sunbula': 'Sunbula', 'zod_tarozi': 'Tarozi',
          'zod_chayon': 'Chayon', 'zod_oqotar': "O'qotar",
          'zod_tog_echkisi': "Tog' echkisi", 'zod_qovga': "Qovg'a",
          'zod_baliq': 'Baliq',
          'map_pick_location': 'Joylashuvni belgilang',
          'map_hint_text': '📍 Xaritaga bosing yoki GPS orqali aniqlang',
          'use_my_location': 'GPS joylashuv',
          'confirm_location': 'Tasdiqlash',
          'geo_detecting': '📡 Joylashuv aniqlanmoqda...',
          'geo_success': '✅ Joylashuv aniqlandi',
          'geo_error': '❌ Joylashuv aniqlanmadi',
          'geo_not_supported': '❌ GPS qo\'llab-quvvatlanmaydi',
          'map_searching': 'Qidirilmoqda...',
          'map_unknown': 'Noma\'lum joy',
          'map_tap_hint': '📍 Xaritaga bosing — joy belgilanadi',
          'leaderboard_title': '🏆 Reyting',
          'stats_active': '🔥 Faollar',
          'stats_likes': '💙 Like',
          'stats_superlikes': '⭐ Super',
          'interface_language': 'Interfeys tili',
          'champions_title': '🏆 Mutloq chempion',
          'nav_champions': 'Chemp.',
          'top_btn_active': '🔥 Faollar',
          'top_btn_likes': '💙 Like TOP',
          'top_btn_superlikes': '⭐ Super TOP',
          'top_btn_champion': '🏆 Chempion',
          'viewed_title': '👁 Men ko\'rganlarim',
          'nav_viewed': 'Ko\'rganlar',
          'tab_viewed_liked': '💙 Like bergan',
          'tab_viewed_messaged': '💬 Xabar yozgan',
          'no_viewed_liked': 'Hali like bergan anketalar yo\'q',
          'no_viewed_liked_hint': 'Qidirish bo\'limidan anketalar toping va like bosing',
          'no_viewed_messaged': 'Hali xabar yozgan anketalar yo\'q',
          'no_viewed_messaged_hint': 'Qidirish bo\'limidan anketalar toping va xabar yozing',
          'profile_loading': 'Anketa yuklanmoqda...',
          'my_goals_section': 'Mening maqsadlarim',
          'mp_anketa_sub': 'Shaxsiy ma\'lumotlar va fotosurat',
          'mp_goals_title': 'Maqsadlar & Ko\'rganlarim',
          'mp_goals_sub': 'Mening maqsadlarim va ko\'rgan odamlarim',
          'mp_viewed_sub': 'Like bergan va xabar yozgan anketalar',
          'mp_liked_tab': 'Like bergan',
          'mp_messaged_tab': 'Yozgan',
          'like': 'Like',
          'super_like': 'Super Like',
          'write': 'Yozish',
          'country_uz': "O'zbekiston",
          'country_ru': 'Rossiya',
          'country_kz': "Qozog'iston",
          'country_kg': "Qirg'iziston",
          'country_tj': 'Tojikiston',
          'country_tm': 'Turkmaniston',
          'country_az': 'Ozarbayjon',
          'country_am': 'Armaniston',
          'country_ge': 'Gruziya',
          'country_ua': 'Ukraina',
          'country_by': 'Belarus',
          'country_md': 'Moldova',
          'country_other': 'Boshqa',
          'loc_step_hint': 'Davlat → Viloyat → Tuman',
          'country_label': 'Davlat',
          'region_label': 'Viloyat',
          'district_label': 'Tuman / Shahar',
          'all_countries': '— Barcha davlatlar —'
      },
      'ru': {
          'select_language': '🌍 Выберите язык',
          'language_changed': '✅ Язык изменён: {lang}',
          'close': 'Закрыть',
          'change_language': 'Сменить язык',
          'fill_profile': 'Заполнить анкету',
          'about_yourself': 'Расскажите о себе',
          'gender': 'Пол',
          'male': 'Мужчина',
          'female': 'Женщина',
          'select_gender': 'Выберите пол',
          'main_info': 'Основная информация',
          'your_name': 'Ваше имя',
          'your_age': 'Ваш возраст',
          'city_district': 'Город / Район',
          'about_short': 'Кратко о себе',
          'your_zodiac': 'Ваш знак зодиака',
          'select_zodiac': 'Выберите знак',
          'zodiac_hint': 'Укажите знак для лучшего подбора.',
          'interests': 'Интересы',
          'your_goal': 'Ваша цель',
          'photo': 'Фото',
          'upload_photo': 'Загрузить фото',
          'photo_format': 'PNG, JPG • макс 5МБ',
          'photo_hint': 'После загрузки фото можно сохранить.',
          'save_profile': 'Сохранить анкету',
          'search': 'Поиск',
          'find_friends': 'Найти новых друзей',
          'search_by_name': 'По имени',
          'advanced_filters': '🔍 Расширенные фильтры',
          'close_filters': '❌ Закрыть фильтры',
          'age_from': 'От',
          'age_to': 'До',
          'zodiac_search': '⭐ Поиск по знаку зодиака',
          'select_zodiac_search': 'Выберите знак',
          'zodiac_filter_hint': 'Применить фильтр по знаку зодиака.',
          'all_zodiacs': 'Все знаки',
          'only_my_zodiac': 'Показывать только совместимые знаки',
          'chats': 'Чаты',
          'likes_and_chats': 'Лайки и чаты',
          'liked_you': '💖 Вам поставили лайк',
          'conversations': '💬 Переписки',
          'no_chats': 'Пока нет переписок',
          'no_chats_hint': 'Найдите новых друзей в поиске и поставьте лайк!',
          'my_profile': 'Мой профиль',
          'profile_info': 'Информация профиля',
          'loading': 'Загрузка...',
          'edit_profile': 'Редактировать анкету',
          'send_message': '💬 Отправить сообщение',
          'write_first_message': 'Напишите первое сообщение пользователю.',
          'send': '📨 Отправить',
          'daily_limits': '📊 Ежедневные лимиты:',
          'likes_limit': '• Лайк: 25',
          'messages_limit': '• Сообщения: 10',
          'super_likes_limit': '• Супер Лайк: 10',
          'increase_limits': '🎁 Увеличить лимиты:',
          'invite_5': '• Пригласите 5 человек → 1 неделя без лимитов',
          'invite_10': '• Пригласите 10 человек → 1 месяц без лимитов',
          'join_group': '👥 Присоединиться к группе',
          'tomorrow': 'Продолжить завтра',
          'join_group_title': 'Присоединяйтесь к группе',
          'join_group_desc': 'Пригласите друзей в группу и получите безлимитный доступ!',
          'rewards': '🎁 Награды:',
          'reward_5': '• 5 друзей → 1 неделя без лимитов',
          'reward_10': '• 10 друзей → 1 месяц без лимитов',
          'copy': 'Копировать',
          'share_telegram': 'Поделиться в Telegram',
          'super_like_sticker': '⭐ Супер Лайк — Отправить стикер',
          'cancel': 'Отмена',
          'no_one_found': 'Никого не найдено',
          'no_one_hint': 'Пока нет подходящих пользователей. Попробуйте позже.',
          'all_viewed': 'Все просмотрены!',
          'all_viewed_hint': 'Вы просмотрели всех кандидатов. Поищите снова.',
          'search_again': '🔍 Искать снова',
          'match_subtitle': 'Теперь вы можете начать общение',
          'match_btn': 'Отлично!',
          'search_results_title': 'Результаты поиска',
          'limit_exceeded_title': 'Суточный лимит достигнут',
          'limit_exceeded_desc': 'Ваш суточный лимит закончился.',
          'photo_viewer_photo': 'Фото',
          'chat_image_btn': 'Отправить фото',
          'chat_input_placeholder': 'Напишите сообщение...',
          'name_placeholder': 'Ваше полное имя',
          'age_placeholder': 'Например: 22',
          'city_placeholder': 'Ваше место жительства',
          'about_placeholder': 'Кем вы хотите быть...',
          'zodiac_select_btn': 'Выберите знак...',
          'age': 'Возраст',
          'goal': 'Цель',
          'city_label': 'Город',
          'city_search_placeholder': 'Город или район',
          'gender_filter_hint': 'Фильтр по полу',
          'name_search_placeholder': 'Введите имя...',
          'nav_chat': 'Чат',
          'nav_profile': 'Профиль',
          'message_placeholder': 'Привет! Как дела?...',
          'app_title': 'Дружба & Знакомства',
          'close_filters': '❌ Закрыть фильтры',
          'lang_uz': "O'zbekcha",
          'lang_ru': 'Русский',
          'lang_kk': 'Қазақша',
          'lang_ky': 'Кыргызча',
          'lang_kaa': 'Qaraqalpaqsha',
          'lang_tg': 'Тоҷикӣ',
          'lang_en': 'English',
          'chat_user_default': 'Пользователь',
          'goal_dostlik': 'Дружба',
          'goal_tanishuv': 'Знакомство',
          'goal_oila': 'Семья',
          'goal_sevgi': 'Любовь',
          'goal_romantika': 'Романтика',
          'goal_uchrashuv': 'Свидание',
          'goal_virtual': 'Виртуальное общение',
          'goal_boshqa': 'Другое',
          'int_kino': '🍿 Кино',
          'int_musiqa': '🎵 Музыка',
          'int_kitob': '📚 Чтение книг',
          'int_oyinlar': '🎮 Игры',
          'int_teatr': '🎭 Театр',
          'int_muzey': '🏛️ Музеи',
          'int_sanat': '🎨 Искусство',
          'int_foto': '📸 Фото',
          'int_sheeriyat': '📜 Поэзия',
          'int_raqs': '💃 Танцы',
          'int_sport': '⚽ Спорт',
          'int_yoga': '🧘‍♂️ Йога',
          'int_sayr': '🚶‍♂️ Прогулки',
          'int_tennis': '🏓 Настольный теннис',
          'int_sayohat': '✈️ Путешествия',
          'int_plyaj': '🏖️ Пляж',
          'int_shopping': '🛍️ Шоппинг',
          'int_moda': '👗 Мода',
          'int_qahva': '☕ Кофе',
          'int_vino': '🍷 Вино',
          'int_pivo': '🍺 Пиво',
          'int_blog': '✍️ Блоггинг',
          'int_dasturlash': '💻 Программирование',
          'int_shaxmat': '♟️ Шахматы',
          'int_rasm': '🎨 Рисование',
          'int_tillar': '🗣️ Изучение языков',
          'limit_likes_exceeded': 'Ваш суточный лимит лайков исчерпан. Пригласите людей в группу, чтобы увеличить лимит!',
          'limit_messages_exceeded': 'Ваш суточный лимит сообщений исчерпан. Пригласите людей в группу, чтобы увеличить лимит!',
          'limit_super_likes_exceeded': 'Ваш суточный лимит супер-лайков исчерпан. Пригласите людей в группу, чтобы увеличить лимит!',
          'limit_exceeded_default': 'Ваш суточный лимит исчерпан. Пригласите людей в группу, чтобы увеличить лимит!',
          'referral_invite_text': 'Присоединяйтесь к группе знакомств! Находите новых друзей.',
          'referral_invited_count': 'Приглашено в группу',
          'referral_unlimited_until': 'Безлимитный период',
          'referral_recent_invitees': 'Недавно приглашенные',
          'count_pcs': '',
          'count_active_label': 'актив.',
          'count_likes_label': 'лайк',
          'count_super_label': 'супер',
          'count_score_label': 'очко',
          'top_label': 'ТОП',
          'until_date': 'до',
          'no_name': 'Без имени',
          'write_message_to': 'Напишите первое сообщение {name}.',
          'enter_message_text': 'Введите текст сообщения!',
          'error_user_id_not_found': 'Ошибка: ваш идентификатор пользователя не найден.',
          'error_recipient_not_found': 'Ошибка: получатель не найден. Пожалуйста, попробуйте снова.',
          'message_sent': '💬 Сообщение отправлено!',
          'like_sent_with_hint': '💙 Лайк отправлен! Если он/она тоже вас лайкнет, откроется чат.',
          'super_like_sent_hint': '⭐ {sticker} Супер Лайк отправлен! Если примет — откроется чат.',
          'like_not_sent': 'Лайк не отправлен',
          'max_interests_hint': 'Можно выбрать максимум 5 интересов.',
          'zodiac_not_set': 'Ваш знак зодиака не определен',
          'zodiac_not_set_hint': 'Для работы функции "Показывать только совместимые знаки" сначала выберите свой знак в анкете.',
          'searching': 'Поиск...',
          'login_via_telegram': 'Войдите через Telegram',
          'open_in_telegram': 'Для поиска откройте бот в приложении Telegram.',
          'server_error': 'Нет связи с сервером',
          'check_internet': 'Проверьте интернет-соединение или попробуйте позже.',
          'retry_btn': 'Повторить',
          'cannot_connect': 'Не удалось подключиться',
          'compat_good': 'Совместимый знак',
          'compat_difficult': 'Сложный',
          'btn_back': 'Назад',
          'btn_skip': 'Пропустить',
          'btn_dislike': 'Не нравится',
          'send_message_btn': 'Отправить сообщение',
          'cannot_go_back': 'Нельзя вернуться назад',
          'previous_candidate': '⬅️ Предыдущий кандидат',
          'user_id_not_found': 'ID пользователя не найден',
          'generic_error': 'Ошибка',
          'match_super_like': '🎉 Матч! {sticker} Супер Лайк отправлен!',
          'super_like_sent': '⭐ {sticker} Супер Лайк отправлен!',
          'user_not_identified': 'Пользователь не определен',
          'telegram_id_not_found': 'Telegram ID не найден. Откройте Web App внутри Telegram или попробуйте снова.',
          'no_likes_yet': 'Пока нет лайков',
          'no_likes_hint': 'Вам еще никто не отправил лайк.',
          'people_who_liked_you': 'Вам поставили лайк',
          'years_old': 'лет',
          'accept': 'Принять',
          'reject': 'Отклонить',
          'you_rejected': 'Вы отклонили {name}.',
          'error_retry': 'Произошла ошибка. Пожалуйста, попробуйте снова.',
          'age_label': 'Возраст',
          'loc_select_country': '— Выберите страну —',
          'loc_select_region': '— Выберите область —',
          'loc_select_district': '— Выберите район —',
          'loc_all_countries': '— Все страны —',
          'loc_all_regions': '— Все области —',
          'loc_all_districts': '— Все районы —',
          'no_city': 'Город не указан',
          'message': 'Сообщение',
          'block': 'Блок',
          'match_with': 'У вас матч с {name}!',
          'fill_profile_first': 'Сначала заполните профиль',
          'like_sent': '💙 Лайк отправлен!',
          'unknown_error': 'Неизвестно',
          'blocked': '🚫 Заблокировано',
          'default_about': 'Этот пользователь не указал свои цели и интересы.',
          'about_me': 'Обо мне',
          'goals_label': 'Цели',
          'not_specified': 'Не указано',
          'interests_label': 'Интересы',
          'max_interests_display': 'Показано максимум 5 интересов.',
          'open_chat': 'Открыть чат...',
          'your_photo': 'Ваше фото',
          'partner_photo': 'Фото собеседника',
          'click_to_view': 'Нажмите для просмотра',
          'profile_not_loaded': 'Ваш профиль не загружен',
          'profile_not_found': 'Анкета не найдена',
          'please_fill_profile': 'Пожалуйста, сначала заполните анкету.',
          'upload_valid_photo': 'Сначала загрузите правильное фото и дождитесь проверки.',
          'select_gender_prompt': 'Выберите пол!',
          'enter_name_prompt': 'Введите ваше имя!',
          'enter_age_prompt': 'Введите правильный возраст! (16-80)',
          'enter_city_prompt': 'Введите город/район!',
          'select_goal_prompt': 'Выберите хотя бы 1 цель!',
          'profile_saved_success': 'Анкета успешно сохранена!',
          'profile_saved_local': 'Анкета сохранена локально.',
          'images_only': 'Принимаются только файлы изображений.',
          'image_too_large': 'Изображение больше 5МБ!',
          'checking_image': '📸 Проверка изображения, пожалуйста подождите…',
          'face_detected': '🧠 Лицо обнаружено. Загрузка…',
          'checking_image_short': 'Проверка изображения, подождите...',
          'no_person_in_image': 'Человек на фото не найден. Пожалуйста, выберите фото, где видно вас.',
          'image_check_error': 'Ошибка проверки изображения. Проверьте интернет и попробуйте снова.',
          'uploading_image': '📸 Загрузка изображения…',
          'image_uploaded_success': '✅ Изображение загружено. Теперь можно сохранить анкету.',
          'image_read_error': '❌ Ошибка чтения изображения.',
          'image_load_failed': 'Не удалось загрузить изображение',
          'image_ready': '✅ Изображение загружено. Можно сохранить анкету.',
          'person_confirmed_uploading': '🧍 Человек подтвержден. Загрузка…',
          'photo_not_sent_but_saved': 'Фото не отправлено в Telegram, но анкета сохранена.',
          'data_too_long': 'Ошибка: данные слишком длинные.',
          'script_load_failed': 'Не удалось загрузить: {src}',
          'wait_timeout': 'Время ожидания {name} истекло',
          'link_copied': 'Ссылка скопирована!',
          'error_occurred': 'Произошла ошибка.',
          'please_retry': 'Попробуйте снова.',
          'error_prefix': 'Ошибка: ',
          'images_only_error': '❌ Принимаются только файлы изображений.',
          'image_size_error': '❌ Изображение больше 5МБ.',
          'no_person_error': '❌ Человек на фото не найден. Попробуйте снова.',
          'check_error_inet': '❌ Ошибка проверки. Проверьте интернет-соединение.',
          'zod_qoy': 'Овен', 'zod_buzoq': 'Телец', 'zod_egizak': 'Близнецы',
          'zod_qisqichbaqa': 'Рак', 'zod_arslon': 'Лев',
          'zod_sunbula': 'Дева', 'zod_tarozi': 'Весы',
          'zod_chayon': 'Скорпион', 'zod_oqotar': 'Стрелец',
          'zod_tog_echkisi': 'Козерог', 'zod_qovga': 'Водолей',
          'zod_baliq': 'Рыбы',
          'map_pick_location': 'Выберите местоположение',
          'map_hint_text': '📍 Нажмите на карту или используйте GPS',
          'use_my_location': 'GPS локация',
          'confirm_location': 'Подтвердить',
          'geo_detecting': '📡 Определение местоположения...',
          'geo_success': '✅ Местоположение определено',
          'geo_error': '❌ Не удалось определить местоположение',
          'geo_not_supported': '❌ GPS не поддерживается',
          'map_searching': 'Поиск...',
          'map_unknown': 'Неизвестное место',
          'map_tap_hint': '📍 Нажмите на карту — место будет отмечено',
          'leaderboard_title': '🏆 Рейтинг',
          'stats_active': '🔥 Активные',
          'stats_likes': '💙 Лайки',
          'stats_superlikes': '⭐ Супер',
          'interface_language': 'Язык интерфейса',
          'champions_title': '🏆 Абсолютный чемпион',
          'nav_champions': 'Чемп.',
          'top_btn_active': '🔥 Активные',
          'top_btn_likes': '💙 Лайки TOP',
          'top_btn_superlikes': '⭐ Супер TOP',
          'top_btn_champion': '🏆 Чемпион',
          'viewed_title': '👁 Мои просмотры',
          'nav_viewed': 'Просмотры',
          'tab_viewed_liked': '💙 Лайкнул',
          'tab_viewed_messaged': '💬 Написал',
          'no_viewed_liked': 'Пока нет понравившихся анкет',
          'no_viewed_liked_hint': 'Найдите анкеты в поиске и поставьте лайк',
          'no_viewed_messaged': 'Пока нет анкет с сообщениями',
          'no_viewed_messaged_hint': 'Найдите анкеты в поиске и напишите сообщение',
          'profile_loading': 'Загрузка анкеты...',
          'my_goals_section': 'Мои цели',
          'mp_anketa_sub': 'Личные данные и фото',
          'mp_goals_title': 'Цели & Просмотренные',
          'mp_viewed_sub': 'Анкеты с лайком и сообщением',
          'mp_liked_tab': 'Лайкнул',
          'mp_messaged_tab': 'Написал',
          'like': 'Лайк',
          'super_like': 'Супер Лайк',
          'write': 'Написать',
          'referral_recent_invited': 'Недавно приглашённые',
          'mp_goals_sub': 'Мои цели и просмотренные люди',
          'country_uz': 'Узбекистан',
          'country_ru': 'Россия',
          'country_kz': 'Казахстан',
          'country_kg': 'Кыргызстан',
          'country_tj': 'Таджикистан',
          'country_tm': 'Туркменистан',
          'country_az': 'Азербайджан',
          'country_am': 'Армения',
          'country_ge': 'Грузия',
          'country_ua': 'Украина',
          'country_by': 'Беларусь',
          'country_md': 'Молдова',
          'country_other': 'Другое',
          'loc_step_hint': 'Страна → Область → Район',
          'country_label': 'Страна',
          'region_label': 'Область',
          'district_label': 'Район / Город',
          'all_countries': '— Все страны —'
      },
      'kk': {
          'select_language': '🌍 Тілді таңдаңыз',
          'language_changed': '✅ Тіл өзгертілді: {lang}',
          'close': 'Жабу',
          'change_language': 'Тілді ауыстыру',
          'fill_profile': 'Анкета толтыру',
          'about_yourself': 'Өзіңіз туралы айтыңыз',
          'gender': 'Жыныс',
          'male': 'Ер адам',
          'female': 'Әйел',
          'select_gender': 'Жынысты таңдаңыз',
          'main_info': 'Негізгі ақпарат',
          'your_name': 'Атыңыз',
          'your_age': 'Жасыңыз',
          'city_district': 'Қала / Аудан',
          'about_short': 'Өзіңіз туралы қысқаша',
          'your_zodiac': 'Жұлдызнамаңыз',
          'select_zodiac': 'Жұлдызнама таңдаңыз',
          'zodiac_hint': 'Жақсы сәйкестік үшін жұлдызнамаңызды белгілеңіз.',
          'interests': 'Қызығушылықтар',
          'your_goal': 'Мақсатыңыз',
          'photo': 'Фото',
          'upload_photo': 'Фото жүктеу',
          'photo_format': 'PNG, JPG • макс 5МБ',
          'photo_hint': 'Фото жүктегеннен кейін сақтауға болады.',
          'save_profile': 'Анкетаны сақтау',
          'search': 'Іздеу',
          'find_friends': 'Жаңа достар табыңыз',
          'search_by_name': 'Аты бойынша',
          'advanced_filters': '🔍 Кеңейтілген сүзгілер',
          'close_filters': '❌ Сүзгілерді жабу',
          'age_from': 'Бастап',
          'age_to': 'Дейін',
          'zodiac_search': '⭐ Жұлдызнама бойынша іздеу',
          'select_zodiac_search': 'Жұлдызнама таңдаңыз',
          'zodiac_filter_hint': 'Жұлдызнама бойынша сүзгі қолданыңыз.',
          'all_zodiacs': 'Барлық жұлдызнамалар',
          'only_my_zodiac': 'Тек жұлдызнамама сәйкес адамдарды көрсет',
          'chats': 'Чаттар',
          'likes_and_chats': 'Лайктар мен чаттар',
          'liked_you': '💖 Сізге лайк басқандар',
          'conversations': '💬 Әңгімелер',
          'no_chats': 'Әзірше чаттар жоқ',
          'no_chats_hint': 'Іздеу бөлімінен жаңа достар табыңыз және лайк басыңыз!',
          'my_profile': 'Менің профилім',
          'profile_info': 'Профиль ақпараты',
          'loading': 'Жүктелуде...',
          'edit_profile': 'Анкетаны өңдеу',
          'send_message': '💬 Хабар жіберу',
          'write_first_message': 'Пайдаланушыға алғашқы хабарыңызды жазыңыз.',
          'send': '📨 Жіберу',
          'daily_limits': '📊 Күнделікті лимиттер:',
          'likes_limit': '• Лайк: 25',
          'messages_limit': '• Хабар: 10',
          'super_likes_limit': '• Супер Лайк: 10',
          'increase_limits': '🎁 Лимитті арттыру:',
          'invite_5': '• 5 адам қосыңыз → 1 апта лимитсіз',
          'invite_10': '• 10 адам қосыңыз → 1 ай лимитсіз',
          'join_group': '👥 Топқа қосылу',
          'tomorrow': 'Ертең жалғастыру',
          'join_group_title': 'Топқа қосылыңыз',
          'join_group_desc': 'Достарыңызды топқа шақырыңыз және лимитсіз қолданыңыз!',
          'rewards': '🎁 Марапаттар:',
          'reward_5': '• 5 дос → 1 апта лимитсіз',
          'reward_10': '• 10 дос → 1 ай лимитсіз',
          'copy': 'Көшіру',
          'share_telegram': 'Telegram-да бөлісу',
          'super_like_sticker': '⭐ Супер Лайк — Стикер жіберу',
          'cancel': 'Болдырмау',
          'no_one_found': 'Ешкім табылмады',
          'no_one_hint': 'Әзірше сәйкес пайдаланушылар жоқ. Кейінірек қайталаңыз.',
          'all_viewed': 'Барлығы қаралды!',
          'all_viewed_hint': 'Сіз барлық кандидаттарды қарадыңыз. Қайта іздеңіз.',
          'search_again': '🔍 Қайта іздеу',
          'match_subtitle': 'Енді сіз сұхбатпен бастай аласыз',
          'match_btn': 'Тамаша!',
          'search_results_title': 'Іздеу нәтижелері',
          'limit_exceeded_title': 'Күндік лимит аяқталды',
          'limit_exceeded_desc': 'Сіздің күндік лимитіңіз аяқталды.',
          'photo_viewer_photo': 'Фото',
          'chat_image_btn': 'Фото жіберу',
          'chat_input_placeholder': 'Хабар жазыңыз...',
          'name_placeholder': 'Толық атыңыз',
          'age_placeholder': 'Мысалы: 22',
          'city_placeholder': 'Өмір сүру орныңыз',
          'about_placeholder': 'Сіз кім болғысы келесіз...',
          'zodiac_select_btn': 'Жұлдызнама таңдаңыз...',
          'age': 'Жасы',
          'goal': 'Мақсат',
          'city_label': 'Қала',
          'city_search_placeholder': 'Қала немесе аудан',
          'gender_filter_hint': 'Жыныс бойынша сүзгі',
          'name_search_placeholder': 'Атыңызды енгізіңіз...',
          'nav_chat': 'Чат',
          'nav_profile': 'Профиль',
          'message_placeholder': 'Сәлем! Қалайсыз?...',
          'app_title': 'Достық & Танысу',
          'close_filters': '❌ Сүзгілерді жабу',
          'lang_uz': "O'zbekcha",
          'lang_ru': 'Русский',
          'lang_kk': 'Қазақша',
          'lang_ky': 'Кыргызча',
          'lang_kaa': 'Qaraqalpaqsha',
          'lang_tg': 'Тоҷикӣ',
          'lang_en': 'English',
          'chat_user_default': 'Пайдаланушы',
          'goal_dostlik': 'Достық',
          'goal_tanishuv': 'Танысу',
          'goal_oila': 'Отбасы',
          'goal_sevgi': 'Махаббат',
          'goal_romantika': 'Романтика',
          'goal_uchrashuv': 'Кездесу',
          'goal_virtual': 'Виртуал қарым-қатынас',
          'goal_boshqa': 'Басқа',
          'int_kino': '🍿 Кино',
          'int_musiqa': '🎵 Музыка',
          'int_kitob': '📚 Кітап оқу',
          'int_oyinlar': '🎮 Ойындар',
          'int_teatr': '🎭 Театр',
          'int_muzey': '🏛️ Мұражайлар',
          'int_sanat': '🎨 Өнер',
          'int_foto': '📸 Фото',
          'int_sheeriyat': '📜 Поэзия',
          'int_raqs': '💃 Би',
          'int_sport': '⚽ Спорт',
          'int_yoga': '🧘‍♂️ Йога',
          'int_sayr': '🚶‍♂️ Серуен',
          'int_tennis': '🏓 Үстел теннисі',
          'int_sayohat': '✈️ Саяхат',
          'int_plyaj': '🏖️ Жағажай',
          'int_shopping': '🛍️ Шоппинг',
          'int_moda': '👗 Сән',
          'int_qahva': '☕ Кофе',
          'int_vino': '🍷 Шарап',
          'int_pivo': '🍺 Сыра',
          'int_blog': '✍️ Блог жүргізу',
          'int_dasturlash': '💻 Бағдарламалау',
          'int_shaxmat': '♟️ Шахмат',
          'int_rasm': '🎨 Сурет салу',
          'int_tillar': '🗣️ Тіл үйрену',
          'limit_likes_exceeded': 'Күнделікті лайк лимитіңіз бітті. Топқа адам қосып, лимитті арттырыңыз!',
          'limit_messages_exceeded': 'Күнделікті хабар жіберу лимитіңіз бітті. Топқа адам қосып, лимитті арттырыңыз!',
          'limit_super_likes_exceeded': 'Күнделікті Супер Лайк лимитіңіз бітті. Топқа адам қосып, лимитті арттырыңыз!',
          'limit_exceeded_default': 'Күнделікті лимитіңіз бітті. Топқа адам қосып, лимитті арттырыңыз!',
          'referral_invite_text': 'Танысу тобына қосылыңыз! Жаңа достар табыңыз.',
          'referral_invited_count': 'Топқа шақырылғандар',
          'referral_unlimited_until': 'Лимитсіз мерзім',
          'referral_recent_invitees': 'Соңғы шақырылғандар',
          'count_pcs': '',
          'count_active_label': 'белсенділік',
          'count_likes_label': 'лайк',
          'count_super_label': 'супер',
          'count_score_label': 'ұпай',
          'top_label': 'ТОП',
          'until_date': 'дейін',
          'no_name': 'Атысыз',
          'write_message_to': '{name}қа алғашқы хабарыңызды жазыңыз.',
          'enter_message_text': 'Хабар мәтінін енгізіңіз!',
          'error_user_id_not_found': 'Қате: сіздің пайдаланушы идентификаторыңыз табылмады.',
          'error_recipient_not_found': 'Қате: алушы табылмады. Өтінеміз, қайта байқап көріңіз.',
          'message_sent': '💬 Хабар жіберілді!',
          'like_sent_with_hint': '💙 Лайк жіберілді! Егер ол сізді де лайк етсе, чат ашылады.',
          'super_like_sent_hint': '⭐ {sticker} Супер Лайк жіберілді! Қабылдаса — чат ашылады.',
          'like_not_sent': 'Лайк жіберілмеді',
          'max_interests_hint': 'Ең көбі 5 қызығушылықты таңдауға болады.',
          'zodiac_not_set': 'Жұлдызнамаңыз анықталмады',
          'zodiac_not_set_hint': '"Тек менің жұлдызнамама сәйкес адамдарды көрсет" функциясы жұмыс істеуі үшін алдымен анкетаңызда жұлдызнамаңызды дұрыс таңдаңыз.',
          'searching': 'Ізделуде...',
          'login_via_telegram': 'Telegram арқылы кіріңіз',
          'open_in_telegram': 'Іздеу үшін ботты Telegram қолданбасында ашыңыз.',
          'server_error': 'Сервермен байланыс жоқ',
          'check_internet': 'Интернет байланысын тексеріңіз немесе кейінірек байқап көріңіз.',
          'retry_btn': 'Қайта байқау',
          'cannot_connect': 'Қосылу мүмкін емес',
          'compat_good': 'Сәйкес жұлдызнама',
          'compat_difficult': 'Қиын',
          'btn_back': 'Артқа',
          'btn_skip': 'Өткізіп жіберу',
          'btn_dislike': 'Ұнамады',
          'send_message_btn': 'Хабар жіберу',
          'cannot_go_back': 'Артқа қайту мүмкін емес',
          'previous_candidate': '⬅️ Алдыңғы кандидат',
          'user_id_not_found': 'Пайдаланушы ID табылмады',
          'generic_error': 'Қате',
          'match_super_like': '🎉 Мэтч! {sticker} Супер Лайк жіберілді!',
          'super_like_sent': '⭐ {sticker} Супер Лайк жіберілді!',
          'user_not_identified': 'Пайдаланушы анықталмады',
          'telegram_id_not_found': 'Telegram ID табылмады. Web App-ті Telegram ішінде ашыңыз немесе қайта кіріңіз.',
          'no_likes_yet': 'Әзірше лайк жоқ',
          'no_likes_hint': 'Сізге әлі ешкім лайк жібермеген.',
          'people_who_liked_you': 'Сізге лайк басқандар',
          'years_old': 'жас',
          'accept': 'Қабылдау',
          'reject': 'Бас тарту',
          'you_rejected': 'Сіз {name} бас тарттыңыз.',
          'error_retry': 'Қате орын алды. Өтінеміз, қайта байқап көріңіз.',
          'age_label': 'Жасы',
          'loc_select_country': '— Таңдаңыз —',
          'loc_select_region': '— Облысты таңдаңыз —',
          'loc_select_district': '— Ауданды таңдаңыз —',
          'loc_all_countries': '— Барлық елдер —',
          'loc_all_regions': '— Барлық облыстар —',
          'loc_all_districts': '— Барлық аудандар —',
          'no_city': 'Қала көрсетілмеген',
          'message': 'Хабар',
          'block': 'Блок',
          'match_with': '{name} менен мэтч түздіңіз!',
          'fill_profile_first': 'Алдымен профиліңізді толтырыңыз',
          'like_sent': '💙 Лайк жіберілді!',
          'unknown_error': 'Белгісіз',
          'blocked': '🚫 Блокталды',
          'default_about': 'Бұл пайдаланушы өз мақсаттары мен қызығушылықтарын көрсетпеген.',
          'about_me': 'Мен туралы',
          'goals_label': 'Мақсаттар',
          'not_specified': 'Көрсетілмеген',
          'interests_label': 'Қызығушылықтар',
          'max_interests_display': 'Ең көбі 5 қызығушылық көрсетіледі.',
          'open_chat': 'Чатты ашу...',
          'your_photo': 'Сіздің фотоңыз',
          'partner_photo': 'Сөйеседнің фотосы',
          'click_to_view': 'Көру үшін басыңыз',
          'profile_not_loaded': 'Профиліңіз жүктелмеді',
          'profile_not_found': 'Анкета табылмады',
          'please_fill_profile': 'Өтінеміз, алдымен анкетаны толтырыңыз.',
          'upload_valid_photo': 'Алдымен дұрыс фото жүктеп, тексеруден өткізіңіз.',
          'select_gender_prompt': 'Жынысты таңдаңыз!',
          'enter_name_prompt': 'Атыңызды енгізіңіз!',
          'enter_age_prompt': 'Жасыңызды дұрыс енгізіңіз! (16-80)',
          'enter_city_prompt': 'Қала/ауданды енгізіңіз!',
          'select_goal_prompt': 'Кемінде 1 мақсат таңдаңыз!',
          'profile_saved_success': 'Анкета сәтті сақталды!',
          'profile_saved_local': 'Анкета жергілікті сақталды.',
          'images_only': 'Тек сурет файлдары қабылданады.',
          'image_too_large': 'Сурет 5МБ-тен үлкен!',
          'checking_image': '📸 Сурет тексерілуде, өтінеміз күтіңіз…',
          'face_detected': '🧠 Бет анықталды. Жүктеу…',
          'checking_image_short': 'Сурет тексерілуде, аз күтіңіз...',
          'no_person_in_image': 'Суретте адам табылмады. Өтінеміз, өзіңізді көрсететін сурет таңдаңыз.',
          'image_check_error': 'Суретті тексеруде қате. Интернетті тексеріңіз және қайта байқап көріңіз.',
          'uploading_image': '📸 Сурет жүктелуде…',
          'image_uploaded_success': '✅ Сурет жүктелді. Енді анкетаны сақтауға болады.',
          'image_read_error': '❌ Суретті оқуда қате орын алды.',
          'image_load_failed': 'Сурет жүктелмеді',
          'image_ready': '✅ Сурет жүктелді. Анкетаны сақтауға болады.',
          'person_confirmed_uploading': '🧍 Адам расталды. Жүктеу…',
          'photo_not_sent_but_saved': 'Фото Telegram-ға жіберілмеді, бірақ анкета сақталды.',
          'data_too_long': 'Қате: деректер тым ұзын.',
          'script_load_failed': 'Жүктелмеді: {src}',
          'wait_timeout': '{name} күту уақыты бітті',
          'link_copied': 'Сілтеме көшірілді!',
          'error_occurred': 'Қате орын алды.',
          'please_retry': 'Қайта байқап көріңіз.',
          'error_prefix': 'Қате: ',
          'images_only_error': '❌ Тек сурет файлдары қабылданады.',
          'image_size_error': '❌ Сурет 5МБ-тен үлкен.',
          'no_person_error': '❌ Суретте адам табылмады. Қайта байқап көріңіз.',
          'check_error_inet': '❌ Тексеруде қате. Интернет байланысын тексеріңіз.',
          'zod_qoy': 'Қой', 'zod_buzoq': 'Бұқа', 'zod_egizak': 'Егіздер',
          'zod_qisqichbaqa': 'Шаян', 'zod_arslon': 'Арыстан',
          'zod_sunbula': 'Бикеш', 'zod_tarozi': 'Таразы',
          'zod_chayon': 'Сарышаян', 'zod_oqotar': 'Мерген',
          'zod_tog_echkisi': 'Таутеке', 'zod_qovga': 'Құман',
          'zod_baliq': 'Балық',
          'map_pick_location': 'Орынды таңдаңыз',
          'map_hint_text': '📍 Картаға басыңыз немесе GPS пайдаланыңыз',
          'use_my_location': 'GPS орны',
          'confirm_location': 'Растау',
          'geo_detecting': '📡 Орын анықталуда...',
          'geo_success': '✅ Орын анықталды',
          'geo_error': '❌ Орынды анықтау мүмкін болмады',
          'geo_not_supported': '❌ GPS қолданылмайды',
          'map_searching': 'Іздеу...',
          'map_unknown': 'Белгісіз жер',
          'map_tap_hint': '📍 Картаға басыңыз — жер белгіленеді',
          'leaderboard_title': '🏆 Рейтинг',
          'stats_active': '🔥 Белсенділер',
          'stats_likes': '💙 Лайк',
          'stats_superlikes': '⭐ Супер',
          'interface_language': 'Интерфейс тілі',
          'champions_title': '🏆 Үздік чемпион',
          'nav_champions': 'Чемп.',
          'top_btn_active': '🔥 Белсенділер',
          'top_btn_likes': '💙 Лайк TOP',
          'top_btn_superlikes': '⭐ Супер TOP',
          'top_btn_champion': '🏆 Чемпион',
          'viewed_title': '👁 Мен көргендерім',
          'nav_viewed': 'Көргендер',
          'tab_viewed_liked': '💙 Лайк басқан',
          'tab_viewed_messaged': '💬 Хабар жазған',
          'no_viewed_liked': 'Әлі лайк басқан анкеталар жоқ',
          'no_viewed_liked_hint': 'Іздеу бөлімінен анкеталар тапыңыз және лайк басыңыз',
          'no_viewed_messaged': 'Әлі хабар жазған анкеталар жоқ',
          'no_viewed_messaged_hint': 'Іздеу бөлімінен анкеталар тапыңыз және хабар жазыңыз',
          'profile_loading': 'Анкета жүктелуде...',
          'my_goals_section': 'Менің мақсаттарым',
          'mp_anketa_sub': 'Жеке деректер мен фото',
          'mp_goals_title': 'Мақсаттар & Көргендерім',
          'mp_viewed_sub': 'Лайк және хабар жазған анкеталар',
          'mp_liked_tab': 'Лайк басқан',
          'mp_messaged_tab': 'Жазған',
          'like': 'Лайк',
          'super_like': 'Супер Лайк',
          'write': 'Жазу',
          'referral_recent_invited': 'Жақында шақырылғандар',
          'mp_goals_sub': 'Менің мақсаттарым және қараған адамдарым',
          'country_uz': 'Өзбекстан',
          'country_ru': 'Ресей',
          'country_kz': 'Қазақстан',
          'country_kg': 'Қырғызстан',
          'country_tj': 'Тәжікстан',
          'country_tm': 'Түркіменстан',
          'country_az': 'Әзербайжан',
          'country_am': 'Армения',
          'country_ge': 'Грузия',
          'country_ua': 'Украина',
          'country_by': 'Беларусь',
          'country_md': 'Молдова',
          'country_other': 'Басқа',
          'loc_step_hint': 'Ел → Облыс → Аудан',
          'country_label': 'Ел',
          'region_label': 'Облыс',
          'district_label': 'Аудан / Қала',
          'all_countries': '— Барлық елдер —'
      },
      'ky': {
          'select_language': '🌍 Тилди тандаңыз',
          'language_changed': '✅ Тил өзгөртүлдү: {lang}',
          'close': 'Жабуу',
          'change_language': 'Тилди алмаштыруу',
          'fill_profile': 'Анкета толтуруу',
          'about_yourself': 'Өзүңүз жөнүндө айтыңыз',
          'gender': 'Жыныс',
          'male': 'Эркек',
          'female': 'Аял',
          'select_gender': 'Жынысты тандаңыз',
          'main_info': 'Негизги маалымат',
          'your_name': 'Атыңыз',
          'your_age': 'Жашыңыз',
          'city_district': 'Шаар / Район',
          'about_short': 'Өзүңүз жөнүндө кыскача',
          'your_zodiac': 'Жылдызнамаңыз',
          'select_zodiac': 'Жылдызнама тандаңыз',
          'zodiac_hint': 'Жакшы шайкештик үчүн жылдызнамаңызды белгилеңиз.',
          'interests': 'Кызыгуулар',
          'your_goal': 'Максатыңыз',
          'photo': 'Сүрөт',
          'upload_photo': 'Сүрөт жүктөө',
          'photo_format': 'PNG, JPG • макс 5МБ',
          'photo_hint': 'Сүрөт жүктөгөндөн кийин сактоого болот.',
          'save_profile': 'Анкетаны сактоо',
          'search': 'Издөө',
          'find_friends': 'Жаңы досторду табыңыз',
          'search_by_name': 'Аты боюнча',
          'advanced_filters': '🔍 Кеңейтилген чыпкалар',
          'close_filters': '❌ Чыпкаларды жабуу',
          'age_from': 'Баштап',
          'age_to': 'Чейин',
          'zodiac_search': '⭐ Жылдызнама боюнча издөө',
          'select_zodiac_search': 'Жылдызнама тандаңыз',
          'zodiac_filter_hint': 'Жылдызнама боюнча чыпка колдонуңуз.',
          'all_zodiacs': 'Бардык жылдызнамалар',
          'only_my_zodiac': 'Жылдызнамама шайкес адамдарды көрсөт',
          'chats': 'Чаттар',
          'likes_and_chats': 'Лайктар жана чаттар',
          'liked_you': '💖 Сизге лайк баскандар',
          'conversations': '💬 Маектер',
          'no_chats': 'Азырынча чаттар жок',
          'no_chats_hint': 'Издөө бөлүмүнөн жаңы досторду табыңыз жана лайк басыңыз!',
          'my_profile': 'Менин профилим',
          'profile_info': 'Профиль маалыматы',
          'loading': 'Жүктөлүүдө...',
          'edit_profile': 'Анкетаны түзөтүү',
          'send_message': '💬 Билдирүү жөнөтүү',
          'write_first_message': 'Колдонуучуга биринчи билдирүүңүздү жазыңыз.',
          'send': '📨 Жөнөтүү',
          'daily_limits': '📊 Күндөлүк лимиттер:',
          'likes_limit': '• Лайк: 25',
          'messages_limit': '• Билдирүү: 10',
          'super_likes_limit': '• Супер Лайк: 10',
          'increase_limits': '🎁 Лимитти көбөйтүү:',
          'invite_5': '• 5 адам кошуңуз → 1 апта лимитсиз',
          'invite_10': '• 10 адам кошуңуз → 1 ай лимитсиз',
          'join_group': '👥 Топко кошулуу',
          'tomorrow': 'Эртең улантуу',
          'join_group_title': 'Топко кошулуңуз',
          'join_group_desc': 'Досторуңузду топко чакырыңыз жана лимитсиз колдонуңуз!',
          'rewards': '🎁 Сыйлыктар:',
          'reward_5': '• 5 дос → 1 апта лимитсиз',
          'reward_10': '• 10 дос → 1 ай лимитсиз',
          'copy': 'Көчүрүү',
          'share_telegram': 'Telegram-да бөлүшүү',
          'super_like_sticker': '⭐ Супер Лайк — Стикер жөнөтүү',
          'cancel': 'Жокко чыгаруу',
          'no_one_found': 'Эч ким табылбады',
          'no_one_hint': 'Азырынча шайкес колдонуучулар жок. Кийинчерээк кайталаңыз.',
          'all_viewed': 'Баары каралды!',
          'all_viewed_hint': 'Сиз бардык талапкерлерди карадыңыз. Кайта издеңиз.',
          'search_again': '🔍 Кайта издөө',
          'match_subtitle': 'Эми сизинде сүйлөшүп бастей аласыз',
          'match_btn': 'Чокусу!',
          'search_results_title': 'Издөө жыйынтыктары',
          'limit_exceeded_title': 'Күндөлүк лимит бүттү',
          'limit_exceeded_desc': 'Сиздин күндөлүк лимитиңиз бүттү.',
          'photo_viewer_photo': 'Сүрөт',
          'chat_image_btn': 'Сүрөт жөнөтүү',
          'chat_input_placeholder': 'Билдирүү жазыңыз...',
          'name_placeholder': 'Толук ат-жөнүңүз',
          'age_placeholder': 'Мисалы: 22',
          'city_placeholder': 'Жашаган жериңиз',
          'about_placeholder': 'Сиз кимдер болгусу келсеңиз...',
          'zodiac_select_btn': 'Жылдызнама тандаңыз...',
          'age': 'Жашы',
          'goal': 'Максат',
          'city_label': 'Шаар',
          'city_search_placeholder': 'Шаар же район',
          'gender_filter_hint': 'Жыныс боюнча чыпка',
          'name_search_placeholder': 'Ат жөнүңүздү киргизиңиз...',
          'nav_chat': 'Чат',
          'nav_profile': 'Профиль',
          'message_placeholder': 'Салам! Кандайсыз?...',
          'app_title': 'Достук & Таанышуу',
          'close_filters': '❌ Чыпкаларды жабуу',
          'lang_uz': "O'zbekcha",
          'lang_ru': 'Русский',
          'lang_kk': 'Қазақша',
          'lang_ky': 'Кыргызча',
          'lang_kaa': 'Qaraqalpaqsha',
          'lang_tg': 'Тоҷикӣ',
          'lang_en': 'English',
          'chat_user_default': 'Колдонуучу',
          'goal_dostlik': 'Достук',
          'goal_tanishuv': 'Таанышуу',
          'goal_oila': 'Үй-бүлө',
          'goal_sevgi': 'Сүйүү',
          'goal_romantika': 'Романтика',
          'goal_uchrashuv': 'Жолугушуу',
          'goal_virtual': 'Виртуалдык байланыш',
          'goal_boshqa': 'Башка',
          'int_kino': '🍿 Кино',
          'int_musiqa': '🎵 Музыка',
          'int_kitob': '📚 Китеп окуу',
          'int_oyinlar': '🎮 Оюндар',
          'int_teatr': '🎭 Театр',
          'int_muzey': '🏛️ Музейлер',
          'int_sanat': '🎨 Өнөр',
          'int_foto': '📸 Фото',
          'int_sheeriyat': '📜 Поэзия',
          'int_raqs': '💃 Бий',
          'int_sport': '⚽ Спорт',
          'int_yoga': '🧘‍♂️ Йога',
          'int_sayr': '🚶‍♂️ Сейил',
          'int_tennis': '🏓 Үстөл теннис',
          'int_sayohat': '✈️ Саякат',
          'int_plyaj': '🏖️ Жээк',
          'int_shopping': '🛍️ Шоппинг',
          'int_moda': '👗 Мода',
          'int_qahva': '☕ Кофе',
          'int_vino': '🍷 Шарап',
          'int_pivo': '🍺 Сыра',
          'int_blog': '✍️ Блог жүргүзүү',
          'int_dasturlash': '💻 Программалоо',
          'int_shaxmat': '♟️ Шахмат',
          'int_rasm': '🎨 Сүрөт тартуу',
          'int_tillar': '🗣️ Тил үйрөнүү',
          'limit_likes_exceeded': 'Күндөлүк лайк лимитиңиз бүттү. Топко адам кошуп, лимитти көбөйтүңүз!',
          'limit_messages_exceeded': 'Күндөлүк билдирүү жөнөтүү лимитиңиз бүттү. Топко адам кошуп, лимитти көбөйтүңүз!',
          'limit_super_likes_exceeded': 'Күндөлүк Супер Лайк лимитиңиз бүттү. Топко адам кошуп, лимитти көбөйтүңүз!',
          'limit_exceeded_default': 'Күндөлүк лимитиңиз бүттү. Топко адам кошуп, лимитти көбөйтүңүз!',
          'referral_invite_text': 'Таанышуу тобына кошулуңуз! Жаңы достор табыңыз.',
          'referral_invited_count': 'Топко чакырылгандар',
          'referral_unlimited_until': 'Лимитсиз мөөнөт',
          'referral_recent_invitees': 'Акыркы чакырылгандар',
          'count_pcs': '',
          'count_active_label': 'активд.',
          'count_likes_label': 'лайк',
          'count_super_label': 'супер',
          'count_score_label': 'упай',
          'top_label': 'ТОП',
          'until_date': 'чейин',
          'no_name': 'Атысыз',
          'write_message_to': '{name}га биринчи билдирүүңүздү жазыңыз.',
          'enter_message_text': 'Билдирүү текстин киргизиңиз!',
          'error_user_id_not_found': 'Ката: сиздин колдонуучу идентификаторуңуз табылган жок.',
          'error_recipient_not_found': 'Ката: алуучу табылган жок. Сураныч, кайра аракет кылыңыз.',
          'message_sent': '💬 Билдирүү жиберилди!',
          'like_sent_with_hint': '💙 Лайк жиберилди! Эгер ал сизди да лайк кылса, чат ачылат.',
          'super_like_sent_hint': '⭐ {sticker} Супер Лайк жиберилди! Кабыл алса — чат ачылат.',
          'like_not_sent': 'Лайк жиберилген жок',
          'max_interests_hint': 'Эң көбү 5 кызыгуу тандаса болот.',
          'zodiac_not_set': 'Жылдызнамаңыз аныкталган жок',
          'zodiac_not_set_hint': '"Тек жылдызнамама шайкеш адамдарды көрсөт" функциясы иштөөсү үчүн алдын ала анкетаңызда жылдызнамаңызды туура тандаңыз.',
          'searching': 'Изделүүдө...',
          'login_via_telegram': 'Telegram аркылуу киргиле',
          'open_in_telegram': 'Издөө үчүн ботту Telegram тиркемесинде ачыңыз.',
          'server_error': 'Сервер менен байланыш жок',
          'check_internet': 'Интернет байланышын текшериңиз же кийинчерээк аракет кылыңыз.',
          'retry_btn': 'Кайта аракет',
          'cannot_connect': 'Туташуу мүмкүн эмес',
          'compat_good': 'Шайкеш жылдызнама',
          'compat_difficult': 'Кыйын',
          'btn_back': 'Артка',
          'btn_skip': 'Өткөрүп жиберүү',
          'btn_dislike': 'Жаккан жок',
          'send_message_btn': 'Билдирүү жөнөтүү',
          'cannot_go_back': 'Артка кайтуу мүмкүн эмес',
          'previous_candidate': '⬅️ Мурдагы талапкер',
          'user_id_not_found': 'Колдонуучу ID табылган жок',
          'generic_error': 'Ката',
          'match_super_like': '🎉 Мэтч! {sticker} Супер Лайк жиберилди!',
          'super_like_sent': '⭐ {sticker} Супер Лайк жиберилди!',
          'user_not_identified': 'Колдонуучу аныкталган жок',
          'telegram_id_not_found': 'Telegram ID табылган жок. Web Appти Telegram ичинде ачыңыз же кайра киргиле.',
          'no_likes_yet': 'Азырынча лайк жок',
          'no_likes_hint': 'Сизге азырынча эч ким лайк жиберген эмес.',
          'people_who_liked_you': 'Сизге лайк баскандар',
          'years_old': 'жашта',
          'accept': 'Кабыл алуу',
          'reject': 'Баш тартуу',
          'you_rejected': 'Сиз {name} баш тарттыңыз.',
          'error_retry': 'Ката кетти. Сураныч, кайра аракет кылыңыз.',
          'age_label': 'Жашы',
          'loc_select_country': '— Тандаңыз —',
          'loc_select_region': '— Облусту тандаңыз —',
          'loc_select_district': '— Районду тандаңыз —',
          'loc_all_countries': '— Бардык өлкөлөр —',
          'loc_all_regions': '— Бардык облустар —',
          'loc_all_districts': '— Бардык райондор —',
          'no_city': 'Шаар көрсөтүлгөн эмес',
          'message': 'Билдирүү',
          'block': 'Блок',
          'match_with': '{name} менен мэтч түздүңүз!',
          'fill_profile_first': 'Алдын ала профилиңизди толтуруңуз',
          'like_sent': '💙 Лайк жиберилди!',
          'unknown_error': 'Белгисиз',
          'blocked': '🚫 Блокталды',
          'default_about': 'Бул колдонуучу өз максаттарын жана кызыгууларын көрсөтпөй кеткен.',
          'about_me': 'Мен жөнүндө',
          'goals_label': 'Максаттар',
          'not_specified': 'Көрсөтүлгөн эмес',
          'interests_label': 'Кызыгуулар',
          'max_interests_display': 'Эң көбү 5 кызыгуу көрсөтүлөт.',
          'open_chat': 'Чатты ачуу...',
          'your_photo': 'Сиздин сүрөтүңүз',
          'partner_photo': 'Сүйлөшүүчүнүн сүрөтү',
          'click_to_view': 'Көрүү үчүн басыңыз',
          'profile_not_loaded': 'Профилиңиз жүктөлгөн жок',
          'profile_not_found': 'Анкета табылган жок',
          'please_fill_profile': 'Сураныч, алдын ала анкетаны толтуруңуз.',
          'upload_valid_photo': 'Алдын ала туура сүрөт жүктөп, текшерилген болсун.',
          'select_gender_prompt': 'Жынысты тандаңыз!',
          'enter_name_prompt': 'Атыңызды киргизиңиз!',
          'enter_age_prompt': 'Жашыңызды туура киргизиңиз! (16-80)',
          'enter_city_prompt': 'Шаар/район киргизиңиз!',
          'select_goal_prompt': 'Эң аз 1 максат тандаңыз!',
          'profile_saved_success': 'Анкета ийгиликтүү сакталды!',
          'profile_saved_local': 'Анкета жергиликтүү сакталды.',
          'images_only': 'Тек гана сүрөт файлдары кабыл алынат.',
          'image_too_large': 'Сүрөт 5МБдан чоң!',
          'checking_image': '📸 Сүрөт текшерилүүдө, сураныч күтө туруңуз…',
          'face_detected': '🧠 Жүз аныкталды. Жүктөө…',
          'checking_image_short': 'Сүрөт текшерилүүдө, бир аз күтө туруңуз...',
          'no_person_in_image': 'Сүрөттө адам табылган жок. Сураныч, өзүңүздү көрсөтүүчү сүрөт тандаңыз.',
          'image_check_error': 'Сүрөттү текшерүүдө ката. Интернет байланышын текшериңиз жана кайра аракет кылыңыз.',
          'uploading_image': '📸 Сүрөт жүктөлүүдө…',
          'image_uploaded_success': '✅ Сүрөт жүктөдү. Эми анкетаны сактоого болот.',
          'image_read_error': '❌ Сүрөттү окууда ката кетти.',
          'image_load_failed': 'Сүрөт жүктөлгөн жок',
          'image_ready': '✅ Сүрөт жүктөлдү. Анкетаны сактоого болот.',
          'person_confirmed_uploading': '🧍 Адам ырасталды. Жүктөө…',
          'photo_not_sent_but_saved': 'Сүрөт Telegramга жиберилген жок, бирок анкета сакталды.',
          'data_too_long': 'Ката: маалымат өтө узун.',
          'script_load_failed': 'Жүктөлгөн жок: {src}',
          'wait_timeout': '{name} күтүү убактысы бүттү',
          'link_copied': 'Шилтеме көчүрүлдү!',
          'error_occurred': 'Ката кетти.',
          'please_retry': 'Кайра аракет кылыңыз.',
          'error_prefix': 'Ката: ',
          'images_only_error': '❌ Тек гана сүрөт файлдары кабыл алынат.',
          'image_size_error': '❌ Сүрөт 5МБдан чоң.',
          'no_person_error': '❌ Сүрөттө адам табылган жок. Кайра аракет кылыңыз.',
          'check_error_inet': '❌ Текшерүүдө ката. Интернет байланышын текшериңиз.',
          'zod_qoy': 'Кой', 'zod_buzoq': 'Бука', 'zod_egizak': 'Эгиздер',
          'zod_qisqichbaqa': 'Чаян', 'zod_arslon': 'Арстан',
          'zod_sunbula': 'Бикеш', 'zod_tarozi': 'Тараза',
          'zod_chayon': 'Чаян', 'zod_oqotar': 'Жаачы',
          'zod_tog_echkisi': 'Теке', 'zod_qovga': 'Куман',
          'zod_baliq': 'Балык',
          'map_pick_location': 'Жайгашкан жерди тандаңыз',
          'map_hint_text': '📍 Картага басыңыз же GPS колдонуңуз',
          'use_my_location': 'GPS жери',
          'confirm_location': 'Тастыктоо',
          'geo_detecting': '📡 Жер аныкталууда...',
          'geo_success': '✅ Жер аныкталды',
          'geo_error': '❌ Жерди аныктоо мүмкүн болгон жок',
          'geo_not_supported': '❌ GPS колдоого алынбайт',
          'map_searching': 'Издөө...',
          'map_unknown': 'Белгисиз жер',
          'map_tap_hint': '📍 Картага басыңыз — жер белгиленет',
          'leaderboard_title': '🏆 Рейтинг',
          'stats_active': '🔥 Активдүүлөр',
          'stats_likes': '💙 Лайк',
          'stats_superlikes': '⭐ Супер',
          'interface_language': 'Интерфейс тили',
          'champions_title': '🏆 Абсолюттук чемпион',
          'nav_champions': 'Чемп.',
          'top_btn_active': '🔥 Активдүүлөр',
          'top_btn_likes': '💙 Лайк TOP',
          'top_btn_superlikes': '⭐ Супер TOP',
          'top_btn_champion': '🏆 Чемпион',
          'viewed_title': '👁 Мен көргөндөрүм',
          'nav_viewed': 'Көргөндөр',
          'tab_viewed_liked': '💙 Лайк баскан',
          'tab_viewed_messaged': '💬 Билдирүү жазган',
          'no_viewed_liked': 'Азырынча лайк баскан анкеталар жок',
          'no_viewed_liked_hint': 'Издөө бөлүмүнөн анкеталар табыңыз жана лайк баскыңыз',
          'no_viewed_messaged': 'Азырынча билдирүү жазган анкеталар жок',
          'no_viewed_messaged_hint': 'Издөө бөлүмүнөн анкеталар табыңыз жана билдирүү жазыңыз',
          'profile_loading': 'Анкета жүктөлүүдө...',
          'my_goals_section': 'Менин максаттарым',
          'mp_anketa_sub': 'Жеке маалымат жана фото',
          'mp_goals_title': 'Максаттар & Көргөндөрүм',
          'mp_viewed_sub': 'Лайк жана билдирүү жазган анкеталар',
          'mp_liked_tab': 'Лайк баскан',
          'mp_messaged_tab': 'Жазган',
          'like': 'Лайк',
          'super_like': 'Супер Лайк',
          'write': 'Жазуу',
          'referral_recent_invited': 'Жакында чакырылгандар',
          'mp_goals_sub': 'Менин максаттарым жана кариган адамдарым',
          'country_uz': 'Өзбекстан',
          'country_ru': 'Россия',
          'country_kz': 'Казакстан',
          'country_kg': 'Кыргызстан',
          'country_tj': 'Тажикстан',
          'country_tm': 'Түркмөнстан',
          'country_az': 'Азербайжан',
          'country_am': 'Армения',
          'country_ge': 'Грузия',
          'country_ua': 'Украина',
          'country_by': 'Беларусь',
          'country_md': 'Молдова',
          'country_other': 'Башка',
          'loc_step_hint': 'Өлкө → Облус → Район',
          'country_label': 'Өлкө',
          'region_label': 'Облус',
          'district_label': 'Район / Шаар',
          'all_countries': '— Бардык өлкөлөр —'
      },
      'kaa': {
          'select_language': '🌍 Tildi tańlań',
          'language_changed': '✅ Til ózgeritildi: {lang}',
          'close': 'Jabıw',
          'change_language': 'Til almastırıw',
          'fill_profile': 'Anketa toldırıw',
          'about_yourself': 'Ózińiz haqqında aytıń',
          'gender': 'Jınıs',
          'male': 'Er adam',
          'female': 'Hayal',
          'select_gender': 'Jınısty tańlań',
          'main_info': 'Tiykarǵı maǵlıwmat',
          'your_name': 'Atıńız',
          'your_age': 'Jasıńız',
          'city_district': 'Qala / Rayon',
          'about_short': 'Ózińiz haqqında qısqasha',
          'your_zodiac': 'Juldıznamańız',
          'select_zodiac': 'Juldıznama tańlań',
          'zodiac_hint': 'Jaqsı sáykeslik ushın juldıznamańızdı belgileń.',
          'interests': 'Qızıǵıwshılıqlar',
          'your_goal': 'Maqsetińiz',
          'photo': 'Fotosúwret',
          'upload_photo': 'Súwret júklew',
          'photo_format': 'PNG, JPG • maks 5MB',
          'photo_hint': 'Súwret júklep bolǵannan keyin saqlawǵa boladı.',
          'save_profile': 'Anketani saqlaw',
          'search': 'Izlew',
          'find_friends': 'Jaña dostlar tabıń',
          'search_by_name': 'Atı boyınsha',
          'advanced_filters': '🔍 Keńeytilgen filtrler',
          'close_filters': '❌ Filtrlerdi jabıw',
          'age_from': 'Baslap',
          'age_to': 'Shekem',
          'zodiac_search': '⭐ Juldıznama boyınsha izlew',
          'select_zodiac_search': 'Juldıznama tańlań',
          'zodiac_filter_hint': 'Juldıznama boyınsha filtr qollanıń.',
          'all_zodiacs': 'Barlıq juldıznamalar',
          'only_my_zodiac': 'Tek juldıznamama sáykes adamlardı kórset',
          'chats': 'Chatlar',
          'likes_and_chats': 'Layklar hám chatlar',
          'liked_you': '💖 Sizge layk basqanlar',
          'conversations': '💬 Áńgimeler',
          'no_chats': 'Házirshe chatlar joq',
          'no_chats_hint': 'Izlew bóliminen jańa dostlar tabıń hám layk basıń!',
          'my_profile': 'Meniń profilim',
          'profile_info': 'Profil maǵlıwmatı',
          'loading': 'Júklenbekte...',
          'edit_profile': 'Anketani ózgertiw',
          'send_message': '💬 Xabar jiberiw',
          'write_first_message': 'Paydalanıwshıǵa birinshi xabarın jazıń.',
          'send': '📨 Jiberiw',
          'daily_limits': '📊 Kúndelik limitler:',
          'likes_limit': '• Layk: 25',
          'messages_limit': '• Xabar: 10',
          'super_likes_limit': '• Super Layk: 10',
          'increase_limits': '🎁 Limitti arttırıw:',
          'invite_5': '• 5 adam qosıń → 1 hápte limitsiz',
          'invite_10': '• 10 adam qosıń → 1 ay limitsiz',
          'join_group': '👥 Topqa qosılıw',
          'tomorrow': 'Erteń dawam etiw',
          'join_group_title': 'Topqa qosılıń',
          'join_group_desc': 'Dostlarıńızdı topqa shaqırıń hám limitsiz paydalanıń!',
          'rewards': '🎁 Sıylıqlar:',
          'reward_5': '• 5 dos → 1 hápte limitsiz',
          'reward_10': '• 10 dos → 1 ay limitsiz',
          'copy': 'Nusqa',
          'share_telegram': 'Telegramda bólisıw',
          'super_like_sticker': '⭐ Super Layk — Stiker jiberiw',
          'cancel': 'Biykar etiw',
          'no_one_found': 'Eshkim tabılmadı',
          'no_one_hint': 'Házirshe sáykes paydalanıwshılar joq. Keyinirek qaytalań.',
          'all_viewed': 'Barlıǵı qaraldı!',
          'all_viewed_hint': 'Siz barlıq kandidatlarǵa qarádıńız. Qayta izleni.',
          'search_again': '🔍 Qayta izlew',
          'match_subtitle': 'Endi siz mulıqatqa baslay alasız',
          'match_btn': 'Jaqsı!',
          'search_results_title': 'Izlew natijalari',
          'limit_exceeded_title': 'Kúndelik limit tugadı',
          'limit_exceeded_desc': 'Siz limitiṉ́iz tugadi.',
          'photo_viewer_photo': 'Súwret',
          'chat_image_btn': 'Súwret jiberiw',
          'chat_input_placeholder': 'Xabar jazıń...',
          'name_placeholder': 'Tolyq atıńız',
          'age_placeholder': 'Meselen: 22',
          'city_placeholder': 'Ornıńız',
          'about_placeholder': 'Siz kim bolagı kelesiz...',
          'zodiac_select_btn': 'Juldıznama tańlań...',
          'age': 'Jası',
          'goal': 'Maqset',
          'city_label': 'Qala',
          'city_search_placeholder': 'Qala yaki rayon',
          'gender_filter_hint': 'Jınıs boyınsha filtr',
          'name_search_placeholder': 'Atıńızdı kiritiń...',
          'nav_chat': 'Chat',
          'nav_profile': 'Profil',
          'message_placeholder': 'Salam! Qalay sızg?...',
          'app_title': 'Doslıq & Tánisuv',
          'close_filters': '❌ Filtrlerdi jabıw',
          'lang_uz': "O'zbekcha",
          'lang_ru': 'Русский',
          'lang_kk': 'Қазақша',
          'lang_ky': 'Кыргызча',
          'lang_kaa': 'Qaraqalpaqsha',
          'lang_tg': 'Тоҷикӣ',
          'lang_en': 'English',
          'chat_user_default': 'Paydalanıwshı',
          'goal_dostlik': 'Doslıq',
          'goal_tanishuv': 'Tánısıw',
          'goal_oila': 'Aile',
          'goal_sevgi': 'Muhabbat',
          'goal_romantika': 'Romantika',
          'goal_uchrashuv': 'Ushırasıw',
          'goal_virtual': 'Virtual muloqat',
          'goal_boshqa': 'Basqa',
          'int_kino': '🍿 Kino',
          'int_musiqa': '🎵 Mızıka',
          'int_kitob': '📚 Kitap oqıw',
          'int_oyinlar': '🎮 Oyınlar',
          'int_teatr': '🎭 Teatr',
          'int_muzey': '🏛️ Muzeylер',
          'int_sanat': '🎨 Sáwlet',
          'int_foto': '📸 Foto',
          'int_sheeriyat': '📜 Shayiriyat',
          'int_raqs': '💃 Biyiw',
          'int_sport': '⚽ Sport',
          'int_yoga': '🧘‍♂️ Yoga',
          'int_sayr': '🚶‍♂️ Gezintiw',
          'int_tennis': '🏓 Stol tennisi',
          'int_sayohat': '✈️ Sayaxat',
          'int_plyaj': '🏖️ Plyaj',
          'int_shopping': '🛍️ Shopping',
          'int_moda': '👗 Moda',
          'int_qahva': '☕ Qahwa',
          'int_vino': '🍷 Shırap',
          'int_pivo': '🍺 Pivo',
          'int_blog': '✍️ Blog júrgiziv',
          'int_dasturlash': '💻 Programmalastırıw',
          'int_shaxmat': '♟️ Shaxmat',
          'int_rasm': '🎨 Súwret sızıw',
          'int_tillar': '🗣️ Til úyreniw',
          'limit_likes_exceeded': 'Kúndelik layk limittińiz tugadı. Topqa adam qosıp, limitti arttırıń!',
          'limit_messages_exceeded': 'Kúndelik xabar jiberiw limittińiz tugadı. Topqa adam qosıp, limitti arttırıń!',
          'limit_super_likes_exceeded': 'Kúndelik Super Layk limittińiz tugadı. Topqa adam qosıp, limitti arttırıń!',
          'limit_exceeded_default': 'Kúndelik limittińiz tugadı. Topqa adam qosıp, limitti arttırıń!',
          'referral_invite_text': 'Tánisuv topına qosılıń! Jaña dostlar tabıń.',
          'referral_invited_count': 'Topqa shaqırılgandar',
          'referral_unlimited_until': 'Limitsiz dáwir',
          'referral_recent_invitees': 'Aqırǵı shaqırılgandar',
          'count_pcs': 'ta',
          'count_active_label': 'ta faallıq',
          'count_likes_label': 'layk',
          'count_super_label': 'super',
          'count_score_label': 'ball',
          'top_label': 'TOP',
          'until_date': 'shekem',
          'no_name': 'Atısız',
          'write_message_to': '{name}ǵa birinshi xabarıńızdı jazıń.',
          'enter_message_text': 'Xabar matının kiritiń!',
          'error_user_id_not_found': 'Qátelik: siziń paydalanıwshı identifikatorińız tabılmadı.',
          'error_recipient_not_found': 'Qátelik: qabıllawshı tabılmadı. Ótinem, qayta urınıp kóriń.',
          'message_sent': '💬 Xabar jiberildi!',
          'like_sent_with_hint': '💙 Layk jiberildi! Eger ol hám sizdi layk etse, chat ashıladı.',
          'super_like_sent_hint': '⭐ {sticker} Super Layk jiberildi! Qabıl alsa — chat ashıladı.',
          'like_not_sent': 'Layk jiberilmegen',
          'max_interests_hint': 'Eń kópi menen 5 qızıǵıwshılıq saylawǵa boladı.',
          'zodiac_not_set': 'Juldıznamańız anıqlanbadı',
          'zodiac_not_set_hint': '"Tek juldıznamaǵa saykes adamlardı kórset" funkciyası islewshi ushın aldın anketanıńızda juldıznamanıńızdı tuwrı saylań.',
          'searching': 'Izlenbekte...',
          'login_via_telegram': 'Telegram arqalı kiriw',
          'open_in_telegram': 'Izlew ushın bottı Telegram baǵdarlamasında ashıń.',
          'server_error': 'Server menen baylanıs joq',
          'check_internet': 'Internet baylanısın tekseriń yamasa keyinirek urınıp kóriń.',
          'retry_btn': 'Qayta urınıw',
          'cannot_connect': 'Baylanıs ornatılmadı',
          'compat_good': 'Saykes juldıznama',
          'compat_difficult': 'Qıyın',
          'btn_back': 'Artqa',
          'btn_skip': 'Ótkerip jiberiw',
          'btn_dislike': 'Yaqmadı',
          'send_message_btn': 'Xabar jiberiw',
          'cannot_go_back': 'Artqa qaytıw múmkin emes',
          'previous_candidate': '⬅️ Aldınǵı kandidat',
          'user_id_not_found': 'Paydalanıwshı ID tabılmadı',
          'generic_error': 'Qátelik',
          'match_super_like': '🎉 Match! {sticker} Super Layk jiberildi!',
          'super_like_sent': '⭐ {sticker} Super Layk jiberildi!',
          'user_not_identified': 'Paydalanıwshı anıqlanbadı',
          'telegram_id_not_found': 'Telegram ID tabılmadı. Web Appdi Telegram ishinde ashiń yamasa qayta kiriń.',
          'no_likes_yet': 'Házirshe layk joq',
          'no_likes_hint': 'Sizge házirshe heshkim layk jibermegen.',
          'people_who_liked_you': 'Sizge layk basqanlar',
          'years_old': 'jas',
          'accept': 'Qabıl etiw',
          'reject': 'Biykar etiw',
          'you_rejected': 'Siz {name} biykar ettińiz.',
          'error_retry': 'Qátelik júz berdi. Ótinem, qayta urınıp kóriń.',
          'age_label': 'Jası',
          'loc_select_country': '— Tańlaň —',
          'loc_select_region': '— Wılayattı tańlaň —',
          'loc_select_district': '— Rayondı tańlaň —',
          'loc_all_countries': '— Barlıq mámleketler —',
          'loc_all_regions': '— Barlıq wılayatlar —',
          'loc_all_districts': '— Barlıq rayonlar —',
          'no_city': 'Qala kórsetilmegen',
          'message': 'Xabar',
          'block': 'Blok',
          'match_with': '{name} menen match boldıńız!',
          'fill_profile_first': 'Aldın profilińizdi toltırıń',
          'like_sent': '💙 Layk jiberildi!',
          'unknown_error': 'Belgisiz',
          'blocked': '🚫 Bloklandı',
          'default_about': 'Bul paydalanıwshı óz maqseti hám qızıǵıwshılıqların kórsetken.',
          'about_me': 'Men haqqımda',
          'goals_label': 'Maqsetler',
          'not_specified': 'Kórsetilmegen',
          'interests_label': 'Qızıǵıwshılıqlar',
          'max_interests_display': 'Eń kópi menen 5 qızıǵıwshılıq kórsetiledi.',
          'open_chat': 'Súwbatti ashıw...',
          'your_photo': 'Siziń súwretińiz',
          'partner_photo': 'Sóylesiwshiniń súwreti',
          'click_to_view': 'Tolıq kóriw ushın basıń',
          'profile_not_loaded': 'Profilińiz júklenmedi',
          'profile_not_found': 'Anketa tabılmadı',
          'please_fill_profile': 'Ótinem, aldın anketa toltırıń.',
          'upload_valid_photo': 'Aldın tuwrı súwret júklep, tekseriliwge daǵızlantırıń.',
          'select_gender_prompt': 'Jınıstı saylań!',
          'enter_name_prompt': 'Atıńızdı kiritiń!',
          'enter_age_prompt': 'Jasıńızdı tuwrı kiritiń! (16-80)',
          'enter_city_prompt': 'Qala/rayon kiritiń!',
          'select_goal_prompt': 'Keminde 1 maqset saylań!',
          'profile_saved_success': 'Anketa tabıslı saqlandı!',
          'profile_saved_local': 'Anketa máhally saqlandı.',
          'images_only': 'Tek súwret faylları qabıl etiledi.',
          'image_too_large': 'Súwret 5MB dan úlken!',
          'checking_image': '📸 Súwret tekserilmekte, ótinem kutıń…',
          'face_detected': '🧠 Yuz anıqlandı. Júklew…',
          'checking_image_short': 'Súwret tekserilmekte, az kutıń...',
          'no_person_in_image': 'Súwrette insan tabılmadı. Ótinem, ózińizdi kórsetediǵen súwret saylań.',
          'image_check_error': 'Súwretti tekseriwde qátelik. Internet baylanısın tekseriń hám qayta urınıp kóriń.',
          'uploading_image': '📸 Súwret júklenmekte…',
          'image_uploaded_success': '✅ Súwret júklendi. Endi anketa saqlawǵa boladı.',
          'image_read_error': '❌ Súwretti oqıwda qátelik júz berdi.',
          'image_load_failed': 'Súwret júklenmedi',
          'image_ready': '✅ Súwret júklenedi. Anketa saqlaw múmkin.',
          'person_confirmed_uploading': '🧍 Inswan tastıqlandı. Júklew…',
          'photo_not_sent_but_saved': 'Súwret Telegramǵa jiberilmedi, biraq anketa saqlandı.',
          'data_too_long': 'Qátelik: maǵlıwmat júdá uzın.',
          'script_load_failed': 'Júklenmedi: {src}',
          'wait_timeout': '{name} kutıw waqtı tawdı',
          'link_copied': 'Silteme nusqalandı!',
          'error_occurred': 'Qátelik júz berdi.',
          'please_retry': 'Qayta urınıp kóriń.',
          'error_prefix': 'Qátelik: ',
          'images_only_error': '❌ Tek súwret faylları qabıl etiledi.',
          'image_size_error': '❌ Súwret 5MB dan úlken.',
          'no_person_error': '❌ Súwrette insan tabılmadı. Qayta urınıp kóriń.',
          'check_error_inet': '❌ Tekseriwde qátelik. Internet baylanısın tekseriń.',
          'zod_qoy': 'Qoy', 'zod_buzoq': 'Buqa', 'zod_egizak': 'Egizler',
          'zod_qisqichbaqa': 'Shayan', 'zod_arslon': 'Arıslan',
          'zod_sunbula': 'Bikes', 'zod_tarozi': 'Tаразы',
          'zod_chayon': 'Sarıshayan', 'zod_oqotar': 'Jaǵı',
          'zod_tog_echkisi': 'Tawteke', 'zod_qovga': 'Quman',
          'zod_baliq': 'Balıq',
          'map_pick_location': 'Ornı tańlaw',
          'map_hint_text': '📍 Xaritaǵa basıń yaki GPS isletiń',
          'use_my_location': 'GPS orny',
          'confirm_location': 'Tastıyıqlaw',
          'geo_detecting': '📡 Orın anıqlanıwda...',
          'geo_success': '✅ Orın anıqlandi',
          'geo_error': '❌ Ornı anıqlaw múmkin bolmadı',
          'geo_not_supported': '❌ GPS qollap-quwatlanbaydı',
          'map_searching': 'Izlenıwde...',
          'map_unknown': 'Belgisiz jer',
          'map_tap_hint': '📍 Xaritaǵa basıń — jer belgilenedi',
          'leaderboard_title': '🏆 Reytіng',
          'stats_active': '🔥 Belgіlіler',
          'stats_likes': '💙 Like',
          'stats_superlikes': '⭐ Super',
          'interface_language': 'Interfeys tіlі',
          'champions_title': '🏆 Mutloq chempion',
          'nav_champions': 'Chemp.',
          'top_btn_active': '🔥 Belgíler',
          'top_btn_likes': '💙 Layk TOP',
          'top_btn_superlikes': '⭐ Super TOP',
          'top_btn_champion': '🏆 Chempion',
          'viewed_title': '👁 Men kórgеnim',
          'nav_viewed': 'Kórgenler',
          'tab_viewed_liked': '💙 Like basqan',
          'tab_viewed_messaged': '💬 Xabar jazqan',
          'no_viewed_liked': 'Háli like basqan anketalar joq',
          'no_viewed_liked_hint': 'Izlew bólimesinen anketalar tabıń hám like basıń',
          'no_viewed_messaged': 'Háli xabar jazqan anketalar joq',
          'no_viewed_messaged_hint': 'Izlew bólimesinen anketalar tabıń hám xabar jazıń',
          'profile_loading': 'Anketa júklenbekte...',
          'my_goals_section': 'Meniń maqsetlerim',
          'mp_anketa_sub': 'Shaxsiy maǵlıwmatlar hám súwret',
          'mp_goals_title': 'Maqsetler & Kórgenlerim',
          'mp_viewed_sub': 'Layk hám xabar jazǵan anketalar',
          'mp_liked_tab': 'Layk basqan',
          'mp_messaged_tab': 'Jazǵan',
          'like': 'Layk',
          'super_like': 'Super Layk',
          'write': 'Jazıw',
          'referral_recent_invited': 'Jaqında shaqırılǵanlar',
          'mp_goals_sub': 'Meniń maqsetlerim hám kórgen adamlarım',
          'country_uz': "O'zbekstan",
          'country_ru': 'Rossiya',
          'country_kz': "Qazaqstan",
          'country_kg': "Qırǵızstan",
          'country_tj': 'Tájikstan',
          'country_tm': 'Túrkmenistan',
          'country_az': 'Ázerbayjan',
          'country_am': 'Armeniya',
          'country_ge': 'Gruziya',
          'country_ua': 'Ukraina',
          'country_by': 'Belarus',
          'country_md': 'Moldova',
          'country_other': 'Basqa',
          'loc_step_hint': 'Mámleketler → Wılayat → Rayon',
          'country_label': 'Mámleketler',
          'region_label': 'Wılayat',
          'district_label': 'Rayon / Qala',
          'all_countries': '— Barlıq mámleketler —'
      },
      'tg': {
          'select_language': '🌍 Забонро интихоб кунед',
          'language_changed': '✅ Забон иваз шуд: {lang}',
          'close': 'Пӯшидан',
          'change_language': 'Ивази забон',
          'fill_profile': 'Анкетаро пур кунед',
          'about_yourself': 'Дар бораи худатон нақл кунед',
          'gender': 'Ҷинс',
          'male': 'Мард',
          'female': 'Зан',
          'select_gender': 'Ҷинсро интихоб кунед',
          'main_info': 'Маълумоти асосӣ',
          'your_name': 'Номи шумо',
          'your_age': 'Синни шумо',
          'city_district': 'Шаҳр / Ноҳия',
          'about_short': 'Дар бораи худатон кӯтоҳ',
          'your_zodiac': 'Бурҷи шумо',
          'select_zodiac': 'Бурҷро интихоб кунед',
          'zodiac_hint': 'Барои мувофиқати хуб бурҷатонро нишон диҳед.',
          'interests': 'Шавқҳо',
          'your_goal': 'Мақсади шумо',
          'photo': 'Сурат',
          'upload_photo': 'Сурат бор кардан',
          'photo_format': 'PNG, JPG • ҳадди аксар 5МБ',
          'photo_hint': 'Пас аз бор кардани сурат нигоҳ доштан мумкин аст.',
          'save_profile': 'Анкетаро нигоҳ доред',
          'search': 'Ҷустуҷӯ',
          'find_friends': 'Дӯстони нав пайдо кунед',
          'search_by_name': 'Аз рӯи ном',
          'advanced_filters': '🔍 Филтрҳои васеъ',
          'close_filters': '❌ Филтрҳоро пӯшонед',
          'age_from': 'Аз',
          'age_to': 'То',
          'zodiac_search': '⭐ Ҷустуҷӯ аз рӯи бурҷ',
          'select_zodiac_search': 'Бурҷро интихоб кунед',
          'zodiac_filter_hint': 'Филтр аз рӯи бурҷ татбиқ кунед.',
          'all_zodiacs': 'Ҳамаи бурҷҳо',
          'only_my_zodiac': 'Танҳо одамони мувофиқи бурҷамро нишон диҳед',
          'chats': 'Чатҳо',
          'likes_and_chats': 'Лайкҳо ва чатҳо',
          'liked_you': '💖 Ба шумо лайк задаанд',
          'conversations': '💬 Мукотибот',
          'no_chats': 'Ҳанӯз чат нест',
          'no_chats_hint': 'Аз бахши ҷустуҷӯ дӯстони нав пайдо кунед ва лайк занед!',
          'my_profile': 'Профили ман',
          'profile_info': 'Маълумоти профил',
          'loading': 'Бор шуда истодааст...',
          'edit_profile': 'Анкетаро таҳрир кунед',
          'send_message': '💬 Паём фиристодан',
          'write_first_message': 'Ба истифодабаранда паёми аввалинатонро нависед.',
          'send': '📨 Фиристодан',
          'daily_limits': '📊 Лимитҳои ҳаррӯза:',
          'likes_limit': '• Лайк: 25',
          'messages_limit': '• Паём: 10',
          'super_likes_limit': '• Супер Лайк: 10',
          'increase_limits': '🎁 Лимитро зиёд кардан:',
          'invite_5': '• 5 нафар даъват кунед → 1 ҳафта бе лимит',
          'invite_10': '• 10 нафар даъват кунед → 1 моҳ бе лимит',
          'join_group': '👥 Ба гурӯҳ ҳамроҳ шудан',
          'tomorrow': 'Фардо давом додан',
          'join_group_title': 'Ба гурӯҳ ҳамроҳ шавед',
          'join_group_desc': 'Дӯстонатонро ба гурӯҳ даъват кунед ва бе лимит истифода баред!',
          'rewards': '🎁 Мукофотҳо:',
          'reward_5': '• 5 дӯст → 1 ҳафта бе лимит',
          'reward_10': '• 10 дӯст → 1 моҳ бе лимит',
          'copy': 'Нусха',
          'share_telegram': 'Дар Telegram мубодила кардан',
          'super_like_sticker': '⭐ Супер Лайк — Стикер фиристодан',
          'cancel': 'Бекор кардан',
          'no_one_found': 'Ҳеҷ кас ёфт нашуд',
          'no_one_hint': 'Ҳанӯз истифодабарандагони мувофиқ нестанд. Баъдтар боз кӯшиш кунед.',
          'all_viewed': 'Ҳама дида шуд!',
          'all_viewed_hint': 'Шумо ҳамаи номзадҳоро дидед. Боз ҷустуҷӯ кунед.',
          'search_again': '🔍 Боз ҷустуҷӯ',
          'match_subtitle': 'Акнун шумо метавонед муколама оғоз кунед',
          'match_btn': 'Фавқула!',
          'search_results_title': 'Натиҷаҳои ҷустуҷӯ',
          'limit_exceeded_title': 'Ҳадди лимити рӯза тамом шуд',
          'limit_exceeded_desc': 'Ҳадди лимити рӯзаи шумо тамом шуд.',
          'photo_viewer_photo': 'Сурат',
          'chat_image_btn': 'Сурат фиристодан',
          'chat_input_placeholder': 'Паём ёддошт кунед...',
          'name_placeholder': 'Номи пурра шумо',
          'age_placeholder': 'Масалан: 22',
          'city_placeholder': 'Ҷойи сукунатан',
          'about_placeholder': 'Шумо ба чи одам мехоҳед...',
          'zodiac_select_btn': 'Бурҷ интихоб кунед...',
          'age': 'Синн',
          'goal': 'Мақсад',
          'city_label': 'Шаҳр',
          'city_search_placeholder': 'Шаҳр ё ноҳия',
          'gender_filter_hint': 'Филтр аз рӯи ҷинс',
          'name_search_placeholder': 'Номро ворид кунед...',
          'nav_chat': 'Чат',
          'nav_profile': 'Профил',
          'message_placeholder': 'Салом! Хубед?...',
          'app_title': 'Дӯстӣ & Ошноӣ',
          'close_filters': '❌ Филтрҳоро пӯшонед',
          'lang_uz': "O'zbekcha",
          'lang_ru': 'Русский',
          'lang_kk': 'Қазақша',
          'lang_ky': 'Кыргызча',
          'lang_kaa': 'Qaraqalpaqsha',
          'lang_tg': 'Тоҷикӣ',
          'lang_en': 'English',
          'chat_user_default': 'Корбар',
          'goal_dostlik': 'Дӯстӣ',
          'goal_tanishuv': 'Шиносоӣ',
          'goal_oila': 'Оила',
          'goal_sevgi': 'Муҳаббат',
          'goal_romantika': 'Романтика',
          'goal_uchrashuv': 'Вохӯрӣ',
          'goal_virtual': 'Муоширати виртуалӣ',
          'goal_boshqa': 'Дигар',
          'int_kino': '🍿 Кино',
          'int_musiqa': '🎵 Мусиқа',
          'int_kitob': '📚 Китобхонӣ',
          'int_oyinlar': '🎮 Бозиҳо',
          'int_teatr': '🎭 Театр',
          'int_muzey': '🏛️ Осорхонаҳо',
          'int_sanat': '🎨 Санъат',
          'int_foto': '📸 Сурат',
          'int_sheeriyat': '📜 Шеър',
          'int_raqs': '💃 Рақс',
          'int_sport': '⚽ Варзиш',
          'int_yoga': '🧘‍♂️ Йога',
          'int_sayr': '🚶‍♂️ Гашт',
          'int_tennis': '🏓 Теннис рӯи миз',
          'int_sayohat': '✈️ Сайёҳӣ',
          'int_plyaj': '🏖️ Соҳил',
          'int_shopping': '🛍️ Харидорӣ',
          'int_moda': '👗 Мӯд',
          'int_qahva': '☕ Қаҳва',
          'int_vino': '🍷 Шароб',
          'int_pivo': '🍺 Пиво',
          'int_blog': '✍️ Блогнависӣ',
          'int_dasturlash': '💻 Барномасозӣ',
          'int_shaxmat': '♟️ Шатранҷ',
          'int_rasm': '🎨 Наққошӣ',
          'int_tillar': '🗣️ Омӯзиши забонҳо',
          'limit_likes_exceeded': 'Ҳадди лимити лайкҳои рӯзаи шумо тамом шуд. Одамонро ба гурӯҳ даъват кунед, то лимитро зиёд кунед!',
          'limit_messages_exceeded': 'Ҳадди лимити паёмҳои рӯзаи шумо тамом шуд. Одамонро ба гурӯҳ даъват кунед, то лимитро зиёд кунед!',
          'limit_super_likes_exceeded': 'Ҳадди лимити супер-лайкҳои рӯзаи шумо тамом шуд. Одамонро ба гурӯҳ даъват кунед, то лимитро зиёд кунед!',
          'limit_exceeded_default': 'Ҳадди лимити рӯзаи шумо тамом шуд. Одамонро ба гурӯҳ даъват кунед, то лимитро зиёд кунед!',
          'referral_invite_text': 'Ба гурӯҳи ошноӣ ҳамроҳ шавед! Дӯстони нав пайдо кунед.',
          'referral_invited_count': 'Ба гурӯҳ даъват шудаанд',
          'referral_unlimited_until': 'Давраи бе лимит',
          'referral_recent_invitees': 'Даъватҳои охирин',
          'count_pcs': 'та',
          'count_active_label': 'фаъол.',
          'count_likes_label': 'лайк',
          'count_super_label': 'супер',
          'count_score_label': 'хол',
          'top_label': 'ТОП',
          'until_date': 'то',
          'no_name': 'Беном',
          'write_message_to': 'Паёми аввалинатонро ба {name} нависед.',
          'enter_message_text': 'Матни паёмро ворид кунед!',
          'error_user_id_not_found': 'Хатогӣ: идентификатори корбари шумо ёфт нашуд.',
          'error_recipient_not_found': 'Хатогӣ: гиранда ёфт нашуд. Лутфан, боз кӯшиш кунед.',
          'message_sent': '💬 Паём фиристода шуд!',
          'like_sent_with_hint': '💙 Лайк фиристода шуд! Агар ӯ шуморо ҳам лайк кунад, чат кушода мешавад.',
          'super_like_sent_hint': '⭐ {sticker} Супер Лайк фиристода шуд! Агар қабул кунад — чат кушода мешавад.',
          'like_not_sent': 'Лайк фиристода нашуд',
          'max_interests_hint': 'Ҳадди аксар 5 манфиат интихоб кардан мумкин аст.',
          'zodiac_not_set': 'Бурҷи шумо муайян нашуд',
          'zodiac_not_set_hint': 'Барои коркарди функсияи "Танҳо одамони мувофиқи бурҷамро нишон диҳед" аввал дар анкетаи худ бурҷи дуруст интихоб кунед.',
          'searching': 'Ҷустуҷӯ...',
          'login_via_telegram': 'Тавассути Telegram ворид шавед',
          'open_in_telegram': 'Барои ҷустуҷӯ ботро дар барномаи Telegram кушоед.',
          'server_error': 'Алоқа бо сервер нест',
          'check_internet': 'Пайвасти интернетро санҷед ё баъдтар кӯшиш кунед.',
          'retry_btn': 'Боз кӯшиш',
          'cannot_connect': 'Пайваст нашуд',
          'compat_good': 'Бурҷи мувофиқ',
          'compat_difficult': 'Мушкил',
          'btn_back': 'Ба қафо',
          'btn_skip': 'Гузарондан',
          'btn_dislike': 'Написандид',
          'send_message_btn': 'Фиристодани паём',
          'cannot_go_back': 'Бозгашт ба ақиб имконнок нест',
          'previous_candidate': '⬅️ Номзади қаблӣ',
          'user_id_not_found': 'ID-и корбар ёфт нашуд',
          'generic_error': 'Хатогӣ',
          'match_super_like': '🎉 Мос! {sticker} Супер Лайк фиристода шуд!',
          'super_like_sent': '⭐ {sticker} Супер Лайк фиристода шуд!',
          'user_not_identified': 'Корбар муайян нашуд',
          'telegram_id_not_found': 'ID-и Telegram ёфт нашуд. Web App-ро дар дохили Telegram кушоед ё боз ворид шавед.',
          'no_likes_yet': 'Ҳоло лайк нест',
          'no_likes_hint': 'Ба шумо ҳанӯз ҳеҷ кас лайк нафиристодааст.',
          'people_who_liked_you': 'Ба шумо лайк задаанд',
          'years_old': 'сол',
          'accept': 'Қабул',
          'reject': 'Рад кардан',
          'you_rejected': 'Шумо {name} рад кардед.',
          'error_retry': 'Хатогӣ рӯй дод. Лутфан, боз кӯшиш кунед.',
          'age_label': 'Синн',
          'loc_select_country': '— Интихоб кунед —',
          'loc_select_region': '— Вилоятро интихоб кунед —',
          'loc_select_district': '— Ноҳияро интихоб кунед —',
          'loc_all_countries': '— Ҳама кишварҳо —',
          'loc_all_regions': '— Ҳама вилоятҳо —',
          'loc_all_districts': '— Ҳама ноҳияҳо —',
          'no_city': 'Шаҳр нишон дода нашудааст',
          'message': 'Паём',
          'block': 'Блок',
          'match_with': 'Шумо бо {name} мос шудед!',
          'fill_profile_first': 'Аввал профили худро пур кунед',
          'like_sent': '💙 Лайк фиристода шуд!',
          'unknown_error': 'Номаълум',
          'blocked': '🚫 Блок шуд',
          'default_about': 'Ин корбар мақсад ва шавқҳои худро нишон надодааст.',
          'about_me': 'Дар бораи ман',
          'goals_label': 'Мақсадҳо',
          'not_specified': 'Нишон дода нашудааст',
          'interests_label': 'Шавқҳо',
          'max_interests_display': 'Ҳадди аксар 5 шавқ нишон дода мешавад.',
          'open_chat': 'Кушодани чат...',
          'your_photo': 'Акси шумо',
          'partner_photo': 'Акси ҳамсуҳбат',
          'click_to_view': 'Барои кушодан пахш кунед',
          'profile_not_loaded': 'Профили шумо бор нашуд',
          'profile_not_found': 'Анкета ёфт нашуд',
          'please_fill_profile': 'Лутфан, аввал анкетаро пур кунед.',
          'upload_valid_photo': 'Аввал акси дуруст бор кунед ва аз санҷиш гузаред.',
          'select_gender_prompt': 'Ҷинсро интихоб кунед!',
          'enter_name_prompt': 'Номи худро ворид кунед!',
          'enter_age_prompt': 'Синни дурусти худро ворид кунед! (16-80)',
          'enter_city_prompt': 'Шаҳр/ноҳияро ворид кунед!',
          'select_goal_prompt': 'Камаш 1 мақсад интихоб кунед!',
          'profile_saved_success': 'Анкета бомуваффақият нигоҳ дошта шуд!',
          'profile_saved_local': 'Анкета ба таври маҳаллӣ нигоҳ дошта шуд.',
          'images_only': 'Танҳо файлҳои акс қабул карда мешаванд.',
          'image_too_large': 'Акс аз 5МБ калон аст!',
          'checking_image': '📸 Акс дар ҳоли санҷиш, лутфан интизор шавед…',
          'face_detected': '🧠 Юр аниқ шуд. Боркунӣ…',
          'checking_image_short': 'Акс дар ҳоли санҷиш, каме интизор шавед...',
          'no_person_in_image': 'Дар акс касе ёфт нашуд. Лутфан, аксе интихоб кунед, ки шумо дар он намоён бошед.',
          'image_check_error': 'Хатогӣ дар санҷиши акс. Интернетро санҷед ва боз кӯшиш кунед.',
          'uploading_image': '📸 Акс дар ҳоли боркунӣ…',
          'image_uploaded_success': '✅ Акс бор карда шуд. Акнун анкетаро нигоҳ доштан мумкин аст.',
          'image_read_error': '❌ Хатогӣ дар хондани акс.',
          'image_load_failed': 'Акс бор карда нашуд',
          'image_ready': '✅ Акс бор карда шуд. Анкетаро нигоҳ доштан мумкин.',
          'person_confirmed_uploading': '🧍 Шахс тасдиқ шуд. Боркунӣ…',
          'photo_not_sent_but_saved': 'Акс ба Telegram фиристода нашуд, аммо анкета нигоҳ дошта шуд.',
          'data_too_long': 'Хатогӣ: маълумот хеле дароз.',
          'script_load_failed': 'Бор карда нашуд: {src}',
          'wait_timeout': 'Муҳлати интизории {name} ба охир расид',
          'link_copied': 'Пайванд нусха бардошта шуд!',
          'error_occurred': 'Хатогӣ рӯй дод.',
          'please_retry': 'Боз кӯшиш кунед.',
          'error_prefix': 'Хатогӣ: ',
          'images_only_error': '❌ Танҳо файлҳои акс қабул карда мешаванд.',
          'image_size_error': '❌ Акс аз 5МБ калон.',
          'no_person_error': '❌ Дар акс касе ёфт нашуд. Боз кӯшиш кунед.',
          'check_error_inet': '❌ Хатогӣ дар санҷиш. Пайвасти интернетро санҷед.',
          'zod_qoy': 'Ҳамал', 'zod_buzoq': 'Савр', 'zod_egizak': 'Ҷавзо',
          'zod_qisqichbaqa': 'Саратон', 'zod_arslon': 'Асад',
          'zod_sunbula': 'Сунбула', 'zod_tarozi': 'Мизон',
          'zod_chayon': 'Ақраб', 'zod_oqotar': 'Қавс',
          'zod_tog_echkisi': 'Ҷадӣ', 'zod_qovga': 'Далв',
          'zod_baliq': 'Ҳут',
          'map_pick_location': 'Маконро интихоб кунед',
          'map_hint_text': '📍 Ба харита зер кунед ё GPS истифода баред',
          'use_my_location': 'GPS макон',
          'confirm_location': 'Тасдиқ',
          'geo_detecting': '📡 Макон муайян мешавад...',
          'geo_success': '✅ Макон муайян шуд',
          'geo_error': '❌ Муайян кардани макон имкон напазируфт',
          'geo_not_supported': '❌ GPS дастгирӣ намешавад',
          'map_searching': 'Ҷустуҷӯ...',
          'map_unknown': 'Макони номаълум',
          'map_tap_hint': '📍 Ба харита зер кунед — макон қайд мешавад',
          'leaderboard_title': '🏆 Рейтинг',
          'stats_active': '🔥 Фаъолон',
          'stats_likes': '💙 Лайк',
          'stats_superlikes': '⭐ Супер',
          'interface_language': 'Забони интерфейс',
          'champions_title': '🏆 Мутлоқ чемпион',
          'nav_champions': 'Чемп.',
          'top_btn_active': '🔥 Фаъолон',
          'top_btn_likes': '💙 Лайк TOP',
          'top_btn_superlikes': '⭐ Супер TOP',
          'top_btn_champion': '🏆 Чемпион',
          'viewed_title': '👁 Ман дидаам',
          'nav_viewed': 'Дидаҳо',
          'tab_viewed_liked': '💙 Лайк задаам',
          'tab_viewed_messaged': '💬 Паём навиштаам',
          'no_viewed_liked': 'Ҳанӯз лайк задаан анкета нест',
          'no_viewed_liked_hint': 'Аз бахши ҷустуҷӯ анкета ёбед ва лайк занед',
          'no_viewed_messaged': 'Ҳанӯз паём навиштаан анкета нест',
          'no_viewed_messaged_hint': 'Аз бахши ҷустуҷӯ анкета ёбед ва паём нависед',
          'profile_loading': 'Анкета бор шуда истодааст...',
          'my_goals_section': 'Мақсадҳои ман',
          'mp_anketa_sub': 'Маълумоти шахсӣ ва акс',
          'mp_goals_title': 'Мақсадҳо & Дидаҳои ман',
          'mp_viewed_sub': 'Анкетаҳое, ки лайк задам ва навиштам',
          'mp_liked_tab': 'Лайк задам',
          'mp_messaged_tab': 'Навиштам',
          'like': 'Лайк',
          'super_like': 'Супер Лайк',
          'write': 'Навиштан',
          'referral_recent_invited': 'Охирон даъватшудагон',
          'mp_goals_sub': 'Мақсадҳои ман ва одамоне, ки дидаам',
          'country_uz': 'Ӯзбекистон',
          'country_ru': 'Русия',
          'country_kz': 'Қазоқистон',
          'country_kg': 'Қирғизистон',
          'country_tj': 'Тоҷикистон',
          'country_tm': 'Туркманистон',
          'country_az': 'Озарбойҷон',
          'country_am': 'Арманистон',
          'country_ge': 'Гурҷистон',
          'country_ua': 'Украина',
          'country_by': 'Беларус',
          'country_md': 'Молдова',
          'country_other': 'Дигар',
          'loc_step_hint': 'Кишвар → Вилоят → Ноҳия',
          'country_label': 'Кишвар',
          'region_label': 'Вилоят',
          'district_label': 'Ноҳия / Шаҳр',
          'all_countries': '— Ҳама кишварҳо —'
      },
      'en': {
          'select_language': '🌍 Select language',
          'language_changed': '✅ Language changed: {lang}',
          'close': 'Close',
          'change_language': 'Change language',
          'fill_profile': 'Fill out profile',
          'about_yourself': 'Tell us about yourself',
          'gender': 'Gender',
          'male': 'Male',
          'female': 'Female',
          'select_gender': 'Select gender',
          'main_info': 'Main information',
          'your_name': 'Your name',
          'your_age': 'Your age',
          'city_district': 'City / District',
          'about_short': 'A short bio',
          'your_zodiac': 'Your zodiac sign',
          'select_zodiac': 'Select zodiac sign',
          'zodiac_hint': 'Set your zodiac sign for better matches.',
          'interests': 'Interests',
          'your_goal': 'Your goal',
          'photo': 'Photo',
          'upload_photo': 'Upload photo',
          'photo_format': 'PNG, JPG • max 5MB',
          'photo_hint': 'You can save once the photo is uploaded.',
          'save_profile': 'Save profile',
          'search': 'Search',
          'find_friends': 'Find new friends',
          'search_by_name': 'By name',
          'advanced_filters': '🔍 Advanced filters',
          'close_filters': '❌ Close filters',
          'age_from': 'From',
          'age_to': 'To',
          'zodiac_search': '⭐ Search by zodiac sign',
          'select_zodiac_search': 'Select zodiac sign',
          'zodiac_filter_hint': 'Apply a zodiac sign filter to your search.',
          'all_zodiacs': 'All zodiac signs',
          'only_my_zodiac': 'Show only people matching my zodiac sign',
          'chats': 'Chats',
          'likes_and_chats': 'Your likes and chats',
          'liked_you': '💖 People who liked you',
          'conversations': '💬 Conversations',
          'no_chats': "You don't have any chats yet",
          'no_chats_hint': 'Find new friends in the search section and like them!',
          'my_profile': 'My profile',
          'profile_info': 'Your profile information',
          'loading': 'Loading...',
          'edit_profile': 'Edit profile',
          'send_message': '💬 Send message',
          'write_first_message': 'Write your first message to this user.',
          'send': '📨 Send',
          'daily_limits': '📊 Daily limits:',
          'likes_limit': '• Likes: 25',
          'messages_limit': '• Messages: 10',
          'super_likes_limit': '• Super Likes: 10',
          'increase_limits': '🎁 Increase your limit:',
          'invite_5': '• Invite 5 people to the group → 1 week unlimited',
          'invite_10': '• Invite 10 people to the group → 1 month unlimited',
          'join_group': '👥 Join the group',
          'tomorrow': 'Continue tomorrow',
          'join_group_title': 'Join the group',
          'join_group_desc': 'Invite your friends to the group and get unlimited access!',
          'rewards': '🎁 Rewards:',
          'reward_5': '• 5 friends → 1 week unlimited',
          'reward_10': '• 10 friends → 1 month unlimited',
          'copy': 'Copy',
          'share_telegram': 'Share on Telegram',
          'super_like_sticker': '⭐ Super Like — Send a sticker',
          'cancel': 'Cancel',
          'no_one_found': 'No one found',
          'no_one_hint': 'There are no matching users right now. Try again later.',
          'all_viewed': "You've viewed everyone!",
          'all_viewed_hint': "You've viewed all candidates. Search again.",
          'search_again': '🔍 Search again',
          'match_subtitle': 'You can start chatting now',
          'match_btn': 'Awesome!',
          'search_results_title': 'Search results',
          'limit_exceeded_title': 'Daily limit reached',
          'limit_exceeded_desc': 'Your daily limit has been reached.',
          'photo_viewer_photo': 'Photo',
          'chat_image_btn': 'Send photo',
          'chat_input_placeholder': 'Type a message...',
          'name_placeholder': 'Your full name',
          'age_placeholder': 'E.g.: 22',
          'city_placeholder': 'Where you live',
          'about_placeholder': 'Who you want to be...',
          'zodiac_select_btn': 'Select zodiac sign...',
          'age': 'Age',
          'goal': 'Goal',
          'city_label': 'City',
          'city_search_placeholder': 'City or district',
          'gender_filter_hint': 'Filter by gender',
          'name_search_placeholder': 'Enter a name...',
          'nav_chat': 'Chat',
          'nav_profile': 'Profile',
          'message_placeholder': 'Hi! How are you?...',
          'app_title': 'Friendship & Dating',
          'close_filters': '❌ Close filters',
          'lang_uz': "O'zbekcha",
          'lang_ru': 'Русский',
          'lang_kk': 'Қазақша',
          'lang_ky': 'Кыргызча',
          'lang_kaa': 'Qaraqalpaqsha',
          'lang_tg': 'Тоҷикӣ',
          'lang_en': 'English',
          'chat_user_default': 'User',
          'goal_dostlik': 'Friendship',
          'goal_tanishuv': 'Dating',
          'goal_oila': 'Family',
          'goal_sevgi': 'Love',
          'goal_romantika': 'Romance',
          'goal_uchrashuv': 'Meeting up',
          'goal_virtual': 'Virtual chatting',
          'goal_boshqa': 'Other',
          'int_kino': '🍿 Movies',
          'int_musiqa': '🎵 Music',
          'int_kitob': '📚 Reading',
          'int_oyinlar': '🎮 Games',
          'int_teatr': '🎭 Theater',
          'int_muzey': '🏛️ Museums',
          'int_sanat': '🎨 Art',
          'int_foto': '📸 Photography',
          'int_sheeriyat': '📜 Poetry',
          'int_raqs': '💃 Dancing',
          'int_sport': '⚽ Sports',
          'int_yoga': '🧘‍♂️ Yoga',
          'int_sayr': '🚶‍♂️ Walking',
          'int_tennis': '🏓 Table tennis',
          'int_sayohat': '✈️ Travel',
          'int_plyaj': '🏖️ Beach',
          'int_shopping': '🛍️ Shopping',
          'int_moda': '👗 Fashion',
          'int_qahva': '☕ Coffee',
          'int_vino': '🍷 Wine',
          'int_pivo': '🍺 Beer',
          'int_blog': '✍️ Blogging',
          'int_dasturlash': '💻 Programming',
          'int_shaxmat': '♟️ Chess',
          'int_rasm': '🎨 Drawing',
          'int_tillar': '🗣️ Learning languages',
          'limit_likes_exceeded': 'Your daily like limit is over. Invite people to the group to increase your limit!',
          'limit_messages_exceeded': 'Your daily message limit is over. Invite people to the group to increase your limit!',
          'limit_super_likes_exceeded': 'Your daily Super Like limit is over. Invite people to the group to increase your limit!',
          'limit_exceeded_default': 'Your daily limit is over. Invite people to the group to increase your limit!',
          'referral_invite_text': 'Join the dating group! Find new friends.',
          'referral_invited_count': 'People invited to the group',
          'referral_unlimited_until': 'Unlimited until',
          'referral_recent_invitees': 'Recently invited', 'referral_recent_invited': 'Recently invited',
          'count_pcs': '',
          'count_active_label': 'acts',
          'count_likes_label': 'likes',
          'count_super_label': 'super',
          'count_score_label': 'pts',
          'top_label': 'TOP',
          'until_date': 'until',
          'no_name': 'No name',
          'write_message_to': 'Write your first message to {name}.',
          'enter_message_text': 'Enter your message!',
          'error_user_id_not_found': 'Error: your user ID was not found.',
          'error_recipient_not_found': 'Error: recipient not found. Please try again.',
          'message_sent': '💬 Message sent!',
          'like_sent_with_hint': "💙 Like sent! If they like you back, you'll get a match and a chat.",
          'super_like_sent_hint': '⭐ {sticker} Super Like sent! If they accept, a chat will open.',
          'like_not_sent': 'Like was not sent',
          'max_interests_hint': 'You can select up to 5 interests.',
          'zodiac_not_set': 'Your zodiac sign is not set',
          'zodiac_not_set_hint': 'For "Show only people matching my zodiac sign" to work, first select your zodiac sign correctly in your profile.',
          'searching': 'Searching...',
          'login_via_telegram': 'Log in via Telegram',
          'open_in_telegram': 'Open the bot in the Telegram app to search.',
          'server_error': 'No connection to the server',
          'check_internet': 'Check your internet connection or try again later.',
          'retry_btn': 'Try again',
          'cannot_connect': 'Could not connect',
          'compat_good': 'Compatible sign',
          'compat_difficult': 'Difficult',
          'btn_back': 'Back',
          'btn_skip': 'Skip',
          'btn_dislike': 'Dislike',
          'send_message_btn': 'Send message',
          'cannot_go_back': "Can't go back",
          'previous_candidate': '⬅️ Previous candidate',
          'user_id_not_found': 'User ID not found',
          'generic_error': 'Error',
          'match_super_like': '🎉 Match! {sticker} Super Like sent!',
          'super_like_sent': '⭐ {sticker} Super Like sent!',
          'user_not_identified': 'User not identified',
          'telegram_id_not_found': 'Telegram ID not found. Open the Web App inside Telegram or sign in again.',
          'no_likes_yet': 'No likes yet',
          'no_likes_hint': "No one has liked you yet.",
          'people_who_liked_you': 'People who liked you',
          'years_old': 'years old',
          'accept': 'Accept',
          'reject': 'Reject',
          'you_rejected': 'You rejected {name}.',
          'error_retry': 'An error occurred. Please try again.',
          'age_label': 'Age',
          'loc_select_country': '— Select country —',
          'loc_select_region': '— Select region —',
          'loc_select_district': '— Select district —',
          'loc_all_countries': '— All countries —',
          'loc_all_regions': '— All regions —',
          'loc_all_districts': '— All districts —',
          'no_city': 'City not specified',
          'message': 'Message',
          'block': 'Block',
          'match_with': "You matched with {name}!",
          'fill_profile_first': 'Please fill out your profile first',
          'like_sent': '💙 Like sent!',
          'unknown_error': 'Unknown',
          'blocked': '🚫 Blocked',
          'default_about': 'This user has shared their goals and interests.',
          'about_me': 'About me',
          'goals_label': 'Goals',
          'not_specified': 'Not specified',
          'interests_label': 'Interests',
          'max_interests_display': 'Up to 5 interests are shown.',
          'open_chat': 'Opening chat...',
          'your_photo': 'Photo you sent',
          'partner_photo': "Their photo",
          'click_to_view': 'Click to view full size',
          'profile_not_loaded': 'Your profile failed to load',
          'profile_not_found': 'Profile not found',
          'please_fill_profile': 'Please fill out your profile first.',
          'upload_valid_photo': 'Upload a valid photo first and make sure it passes the check.',
          'select_gender_prompt': 'Select your gender!',
          'enter_name_prompt': 'Enter your name!',
          'enter_age_prompt': 'Enter a valid age! (16-80)',
          'enter_city_prompt': 'Enter your city/district!',
          'select_goal_prompt': 'Select at least 1 goal!',
          'profile_saved_success': 'Profile saved successfully!',
          'profile_saved_local': 'Profile saved locally.',
          'images_only': 'Only image files are accepted.',
          'image_too_large': 'Photo is larger than 5MB!',
          'checking_image': '📸 Checking photo, please wait…',
          'face_detected': '🧠 Face detected. Uploading photo…',
          'checking_image_short': 'Checking photo, please wait a moment...',
          'no_person_in_image': 'No person was found in the photo. Please choose a photo that shows you.',
          'image_check_error': 'Error checking the photo. Check your internet connection and try again.',
          'uploading_image': '📸 Uploading photo…',
          'image_uploaded_success': '✅ Photo uploaded. You can now save your profile.',
          'image_read_error': '❌ Error reading the photo.',
          'image_load_failed': 'Photo failed to load',
          'image_ready': '✅ Photo uploaded. You can save your profile.',
          'person_confirmed_uploading': '🧍 Person confirmed in photo. Uploading…',
          'photo_not_sent_but_saved': 'The photo was not sent to Telegram, but your profile was saved.',
          'data_too_long': 'Error: data is too long.',
          'script_load_failed': 'Failed to load: {src}',
          'wait_timeout': 'Waiting time for {name} expired',
          'link_copied': 'Link copied!',
          'error_occurred': 'An error occurred.',
          'please_retry': 'Please try again.',
          'error_prefix': 'Error: ',
          'images_only_error': '❌ Only image files are accepted.',
          'image_size_error': '❌ Photo is larger than 5MB.',
          'no_person_error': '❌ No person found in the photo. Try again.',
          'check_error_inet': '❌ Error during check. Check your internet connection.',
          'zod_qoy': 'Aries', 'zod_buzoq': 'Taurus', 'zod_egizak': 'Gemini',
          'zod_qisqichbaqa': 'Cancer', 'zod_arslon': 'Leo',
          'zod_sunbula': 'Virgo', 'zod_tarozi': 'Libra',
          'zod_chayon': 'Scorpio', 'zod_oqotar': 'Sagittarius',
          'zod_tog_echkisi': 'Capricorn', 'zod_qovga': 'Aquarius',
          'zod_baliq': 'Pisces',
          'map_pick_location': 'Pick your location',
          'map_hint_text': '📍 Tap the map or use GPS',
          'use_my_location': 'Use GPS',
          'confirm_location': 'Confirm',
          'geo_detecting': '📡 Detecting location...',
          'geo_success': '✅ Location detected',
          'geo_error': '❌ Could not detect location',
          'geo_not_supported': '❌ GPS not supported',
          'map_searching': 'Searching...',
          'map_unknown': 'Unknown location',
          'map_tap_hint': '📍 Tap the map — location will be pinned',
          'leaderboard_title': '🏆 Leaderboard',
          'stats_active': '🔥 Active',
          'stats_likes': '💙 Likes',
          'stats_superlikes': '⭐ Super',
          'interface_language': 'Interface language',
          'champions_title': '🏆 Absolute Champion',
          'nav_champions': 'Champ.',
          'top_btn_active': '🔥 Active',
          'top_btn_likes': '💙 Likes TOP',
          'top_btn_superlikes': '⭐ Super TOP',
          'top_btn_champion': '🏆 Champion',
          'viewed_title': '👁 My Views',
          'nav_viewed': 'Viewed',
          'tab_viewed_liked': '💙 Liked',
          'tab_viewed_messaged': '💬 Messaged',
          'no_viewed_liked': 'No liked profiles yet',
          'no_viewed_liked_hint': 'Find profiles in search and like them',
          'no_viewed_messaged': 'No messaged profiles yet',
          'no_viewed_messaged_hint': 'Find profiles in search and send a message',
          'profile_loading': 'Loading profile...',
          'my_goals_section': 'My Goals',
          'mp_anketa_sub': 'Personal info and photo',
          'mp_goals_title': 'Goals & Viewed',
          'mp_goals_sub': 'My goals and people I\'ve viewed',
          'mp_liked_tab': 'Liked',
          'mp_messaged_tab': 'Messaged',
          'like': 'Like',
          'super_like': 'Super Like',
          'write': 'Write',
          'mp_viewed_sub': 'Profiles you liked and messaged',
          'country_uz': 'Uzbekistan',
          'country_ru': 'Russia',
          'country_kz': 'Kazakhstan',
          'country_kg': 'Kyrgyzstan',
          'country_tj': 'Tajikistan',
          'country_tm': 'Turkmenistan',
          'country_az': 'Azerbaijan',
          'country_am': 'Armenia',
          'country_ge': 'Georgia',
          'country_ua': 'Ukraine',
          'country_by': 'Belarus',
          'country_md': 'Moldova',
          'country_other': 'Other',
          'loc_step_hint': 'Country → Region → District',
          'country_label': 'Country',
          'region_label': 'Region',
          'district_label': 'District / City',
          'all_countries': '— All countries —'
      },
  };

  // app.js da - tr funksiyasini yangilang:
  function tr(key) {
      if (!key) return key;
      const lang = currentLang || 'uz';
      
      // Avval joriy til dan qidirish
      if (WEBAPP_T[lang] && WEBAPP_T[lang][key]) {
          return WEBAPP_T[lang][key];
      }
      
      // Keyin o'zbek tilidan qidirish (fallback)
      if (WEBAPP_T['uz'] && WEBAPP_T['uz'][key]) {
          return WEBAPP_T['uz'][key];
      }

      // Agar key topilmasa, eski bazadagi tarjima qilingan matnni key sifatida qidirish
      // (masalan "Do'stlik" ni o'zbek tilida saqlangan bo'lsa, rus tilidagi "Дружба" ni qaytarish)
      if (lang !== 'uz' && WEBAPP_T['uz']) {
          const uzEntries = Object.entries(WEBAPP_T['uz']);
          const found = uzEntries.find(([k, v]) => v === key);
          if (found && WEBAPP_T[lang] && WEBAPP_T[lang][found[0]]) {
              return WEBAPP_T[lang][found[0]];
          }
      }
      
      // Agar topilmasa, key ni qaytarish
      return key;
  }

  function applyTranslations() {
      console.log('Applying translations for:', currentLang); // Debug

      document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          const text = tr(key);
          if (text) {
              el.textContent = text;
          }
      });

      // Placeholder larni ham yangilash
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
          const key = el.getAttribute('data-i18n-placeholder');
          const text = tr(key);
          if (text) {
              el.placeholder = text;
          }
      });

      // Title atributlarni yangilash
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
          const key = el.getAttribute('data-i18n-title');
          const text = tr(key);
          if (text) {
              el.title = text;
          }
      });

      // Chip va Zodiac option matnlarini tarjima qilish (data-i18n-chip atributi orqali)
      document.querySelectorAll('[data-i18n-chip]').forEach(el => {
          const key = el.getAttribute('data-i18n-chip');
          const text = tr(key);
          if (text) {
              // Emoji prefixi saqlab qolish: agar matn emoji bilan boshlansa, faqat so'z qismini almashtirish
              const currentText = el.textContent;
              const emojiMatch = currentText.match(/^([\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}♟️♎♏♐♑♒♓♈♉♊♋♌♍]\s*)/u);
              if (emojiMatch) {
                  const translatedText = tr(key);
                  // If translation already has emoji, use as-is
                  if (/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}♟️]/u.test(translatedText)) {
                      el.textContent = translatedText;
                  } else {
                      el.textContent = emojiMatch[0] + translatedText.replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}♟️]\s*/u, '');
                  }
              } else {
                  el.textContent = text;
              }
          }
      });

      // Til o'zgarganda location dropdownlarni joriy tilda qayta qurish
      refreshLocationDropdownsForLang();
  }

  // Til o'zgarganda location dropdownlarni qayta qurish
  function refreshLocationDropdownsForLang() {
    if (!uzbekCitiesML) return;
    const lang = currentLang || 'uz';

    // Trigger placeholder larini yangi tilda yangilash
    const placeholders = {
      'inp-country':  tr('loc_select_country')  || '— Tanlang —',
      'inp-region':   tr('loc_select_region')   || '— Viloyatni tanlang —',
      'inp-district': tr('loc_select_district') || '— Tumanni tanlang —',
      'sf-country':   tr('loc_all_countries')   || '— Barcha davlatlar —',
      'sf-region':    tr('loc_all_regions')     || '— Barcha viloyatlar —',
      'sf-district':  tr('loc_all_districts')   || '— Barcha tumanlar —',
    };
    Object.entries(placeholders).forEach(([id, ph]) => {
      const valEl = document.getElementById(id + '-trigger-val');
      if (valEl && valEl.classList.contains('placeholder')) valEl.textContent = ph;
    });

    // Davlat dropdown options ni yangi tilda qayta qur
    ['inp-country', 'sf-country'].forEach(id => {
      const wrap = document.getElementById(id + '-wrap');
      if (!wrap) return;
      const native = document.getElementById(id);
      const currentVal = native ? native.value : '';
      const isSearch = id.startsWith('sf-');
      const opts = getCountriesList(isSearch);
      rebuildLocOptions(id, opts, false);
      // Tanlangan davlat trigger matnini yangi tilda yangilash
      if (currentVal) {
        const selOpt = opts.find(o => o.value === currentVal);
        const valEl = document.getElementById(id + '-trigger-val');
        if (valEl && selOpt) { valEl.textContent = selOpt.label; valEl.classList.remove('placeholder'); }
        document.querySelectorAll(`#${id}-opts .loc-option`).forEach(o => {
          o.classList.toggle('selected', o.dataset.value === currentVal);
        });
      }
    });

    // Viloyat trigger matnini joriy tilda ko'rsatish
    ['inp-region', 'sf-region'].forEach(id => {
      const native = document.getElementById(id);
      if (!native || !native.value) return;
      const valEl = document.getElementById(id + '-trigger-val');
      if (!valEl) return;
      const uzRegions = Object.keys(uzbekCitiesML['uz'] || {});
      const langRegions = Object.keys(uzbekCitiesML[lang] || {});
      const idx = uzRegions.indexOf(native.value);
      const langIdx = langRegions.indexOf(native.value);
      if (idx !== -1 && langRegions[idx]) {
        valEl.textContent = langRegions[idx];
      } else if (langIdx !== -1) {
        // already in current lang
      }
    });

    // Viloyat dropdown ochiq bo'lsa options ni qayta qur
    ['inp-region', 'sf-region'].forEach(id => {
      const wrap = document.getElementById(id + '-wrap');
      if (!wrap || wrap.style.display === 'none') return;
      const native = document.getElementById(id);
      const currentVal = native ? native.value : '';
      const regions = getUzbekRegions(); // endi joriy tilda
      const opts = Object.keys(regions);
      rebuildLocOptions(id, opts, true);
      if (currentVal) {
        document.querySelectorAll(`#${id}-opts .loc-option`).forEach(o => {
          o.classList.toggle('selected', o.dataset.value === currentVal);
        });
      }
    });

    // Tuman dropdown options ni ham qayta qur
    ['inp-district', 'sf-district'].forEach(id => {
      const wrap = document.getElementById(id + '-wrap');
      if (!wrap || wrap.style.display === 'none') return;
      const regionId = id.replace('district', 'region');
      const regionNative = document.getElementById(regionId);
      if (!regionNative || !regionNative.value) return;
      const regions = getUzbekRegions();
      let districts = regions[regionNative.value] || [];
      if (!districts.length && uzbekCitiesML) {
        const uzRegions = uzbekCitiesML['uz'] || {};
        const uzKeys = Object.keys(uzRegions);
        const langRegions = Object.keys(regions);
        const langIdx = langRegions.indexOf(regionNative.value);
        if (langIdx !== -1 && uzKeys[langIdx]) {
          districts = uzRegions[uzKeys[langIdx]] || [];
        }
      }
      if (!districts.length) return;
      const native = document.getElementById(id);
      const currentVal = native ? native.value : '';
      rebuildLocOptions(id, districts, false);
      if (currentVal) {
        document.querySelectorAll(`#${id}-opts .loc-option`).forEach(o => {
          o.classList.toggle('selected', o.dataset.value === currentVal);
        });
      }
    });
  }

  // Joriy faol sahifadagi dinamik matnlarni til o'zgarganda yangilash
  function refreshCurrentPageTranslations() {
      // Hozirgi ko'rinayotgan sahifani aniqlab, qayta yuklash
      const activePage = document.querySelector('.page.active');
      if (!activePage) return;
      const pageId = activePage.id;

      if (pageId === 'page-search') {
          // Qidiruv sahifasidagi statik matnlar
          applyTranslations();
      } else if (pageId === 'page-profile') {
          applyTranslations();
      } else if (pageId === 'page-chats') {
          // Chat sahifasidagi matnlar - qayta yuklanishi kerak
          applyTranslations();
          if (typeof loadChats === 'function') loadChats();
      } else if (pageId === 'page-myprofile') {
          applyTranslations();
          if (typeof loadMyProfile === 'function') loadMyProfile();
          // Goals bo'limi ochiq bo'lsa, uni ham qayta render qilish
          const goalsBody = document.getElementById('mp-body-goals');
          if (goalsBody && goalsBody.style.display !== 'none') {
              if (typeof loadMpViewed === 'function') loadMpViewed(_currentMpViewedTab || 'liked');
          }
      } else {
          applyTranslations();
      }
  }

  function openLangModal() {
      const modal = document.getElementById('lang-modal');
      if (modal) {
          modal.classList.add('show');
          // Highlight current language
          document.querySelectorAll('.lang-btn').forEach(btn => {
              btn.classList.toggle('selected', btn.dataset.lang === currentLang);
          });
      }
  }

  function closeLangModal() {
      const modal = document.getElementById('lang-modal');
      if (modal) {
          modal.classList.remove('show');
      }
  }


  async function selectLanguage(langCode) {
      if (!SUPPORTED_LANGUAGES[langCode]) return;

      currentLang = langCode;
      localStorage.setItem('app_language', langCode);

      // UI ni yangilash
      document.querySelectorAll('.lang-btn').forEach(btn => {
          btn.classList.toggle('selected', btn.dataset.lang === langCode);
      });

      applyTranslations();
      // Dinamik render qilingan sahifadagi matnlarni ham yangilash
      refreshCurrentPageTranslations();
      // Profil sahifasidagi til ko'rinishini yangilash
      if (typeof updateProfileLangDisplay === 'function') updateProfileLangDisplay();
      if (typeof updateMiniStatsLabels === 'function') updateMiniStatsLabels();

      // Backend ga saqlash
      await saveLanguageToBackend(langCode);

      const langName = SUPPORTED_LANGUAGES[langCode].name;
      showToast(tr('language_changed').replace('{lang}', langName));

      // Modalni yopish
      setTimeout(() => {
          closeLangModal();
      }, 800);
  }

  // Backend'dan foydalanuvchi tilini yuklash (Promise qaytaradi)
  async function loadUserLanguage() {
      if (!userId) return;
      try {
          const data = await apiPost('/api/language', { telegram_id: userId });
          if (data.success && data.language) {
              currentLang = data.language;
              localStorage.setItem('app_language', currentLang);
              applyTranslations();
              console.log('Language loaded from backend:', currentLang);
          }
      } catch (e) {
          console.warn('Failed to load language from backend:', e);
      }
  }

  // Tilni saqlash (web app'dan backend'ga)
  async function saveLanguageToBackend(langCode) {
      if (!userId) return;
      try {
          await apiPost('/api/language', {
              telegram_id: userId,
              language: langCode
          });
      } catch (e) {
          console.warn('Failed to save language to backend:', e);
      }
  }

  
// Telegram WebApp dan tilni aniqlash (initDataUnsafe.user.language_code)
function detectTelegramLanguage() {
  if (!tg) return;

  let tgLang = null;

  // Try initDataUnsafe first
  if (tg.initDataUnsafe?.user?.language_code) {
    tgLang = tg.initDataUnsafe.user.language_code;
  }
  // Fallback to initData parsing
  else if (tg.initData) {
    try {
      const params = new URLSearchParams(tg.initData);
      const userJson = params.get('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        tgLang = user.language_code;
      }
    } catch (e) {}
  }

  if (tgLang) {
    const langMap = {
      'uz': 'uz', 'ru': 'ru', 'kk': 'kk', 'ky': 'ky',
      'kaa': 'kaa', 'tg': 'tg', 'en': 'en'
    };

    let detectedLang = null;

    // Exact match
    if (langMap[tgLang]) {
      detectedLang = langMap[tgLang];
    } else {
      // Prefix match (e.g., 'ru-RU' -> 'ru')
      const prefix = tgLang.split('-')[0];
      if (langMap[prefix]) {
        detectedLang = langMap[prefix];
      }
    }

    if (detectedLang && SUPPORTED_LANGUAGES[detectedLang]) {
      currentLang = detectedLang;
      localStorage.setItem('app_language', currentLang);
      console.log('Language detected from Telegram:', tgLang, '->', detectedLang);
    }
  }
}

// initLanguage - Promise qaytaradi, DOMContentLoaded await qilishi uchun
  async function initLanguage() {
      // If Telegram already detected a language, trust it
      // Otherwise fall back to localStorage
      const savedLang = localStorage.getItem('app_language');
      if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
          // Only use savedLang if Telegram didn't already set currentLang
          if (!currentLang || currentLang === 'uz') {
              currentLang = savedLang;
          }
      }
      applyTranslations();

      // If userId exists, also sync with backend (backend is source of truth)
      if (userId) {
          await loadUserLanguage();
      }
      // Final apply after all sources checked
      applyTranslations();
  }

  const PROFILE_STORAGE_PREFIX = 'dating_profile_';

  function getProfileStorageKey(targetId = userId) {
    if (targetId && Number.isFinite(Number(targetId))) {
      return `${PROFILE_STORAGE_PREFIX}${Number(targetId)}`;
    }
    // Guest users get a unique session-based key so they don't share data
    return `${PROFILE_STORAGE_PREFIX}guest_${getSessionId()}`;
  }

  function removeLegacyProfileStorage() {
    try {
      localStorage.removeItem('dating_profile');
    } catch (e) {
      console.warn('Legacy profile storage cleanup failed', e);
    }
  }

  const API_BASE_URL = 'https://tanishuvbot-production.up.railway.app';
  const DEFAULT_GROUP_INVITE_LINK = 'https://t.me/+HA4J8P7lht0zZTdi';

  const MAX_WEBAPP_DATA_SIZE = 6000;
  const MAX_INTERESTS_ALLOWED = 5;

  function sendWebAppData(payload) {
    if (!tg) return;
    const json = JSON.stringify(payload);
    if (json.length <= MAX_WEBAPP_DATA_SIZE) {
      tg.sendData(json);
      return;
    }
    if (payload.action === 'save_profile' && payload.profile) {
      const safeProfile = { ...payload.profile, photo_base64: null };
      const safePayload = { ...payload, profile: safeProfile };
      const safeJson = JSON.stringify(safePayload);
      if (safeJson.length <= MAX_WEBAPP_DATA_SIZE) {
        tg.sendData(safeJson);
        showToast(tr('photo_not_sent_but_saved'));
        return;
      }
    }
    showToast(tr('data_too_long'));
  }

  const ICONS = {
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    male: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="4"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="12" y1="16" x2="8" y2="22"/><line x1="12" y1="16" x2="16" y2="22"/></svg>`,
    female: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="4"/><path d="M6 20 L10 12 L14 12 L18 20"/><line x1="6" y1="18" x2="10" y2="12"/><line x1="18" y1="18" x2="14" y2="12"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    message: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    ban: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
    camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    atSign: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
  };

  let selectedGender = '';
  let selectedSearchGender = '';
  let selectedInterests = [];
  let selectedGoals = [];
  let selectedSearchGoals = [];
  let selectedSearchInterests = [];
  let photoBase64 = '';
  let photoReady = false;
  let photoUploading = false;
  // REMOVED: let savedProfile = null; — always read from storage per-user

  // ============================================================
  // REGIONLAR regions.json FAYLDAN YUKLANADI
  // ============================================================
  let uzbekCitiesML = null;
  let kazakhstanCitiesML = null;
  let _regionsLoadPromise = null;

  let kyrgyzstanCitiesML = null;
  let tajikistanCitiesML = null;
  let russiaCitiesML = null;
  let hindistonCitiesML = null;
  let mdhCountriesML = null;


  function loadRegionsData() {
  if (_regionsLoadPromise) return _regionsLoadPromise;
  _regionsLoadPromise = fetch('regions.json')
  .then(r => r.json())
  .then(data => {
      uzbekCitiesML = data.uzbekCitiesML;
      kazakhstanCitiesML = data.kazakhstanCitiesML;
      kyrgyzstanCitiesML = data.kyrgyzstanCitiesML || { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };
      tajikistanCitiesML = data.tajikistanCitiesML || { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };
      
      // YANGI QO'SHILGAN QISM:
      russiaCitiesML = data.russiaCitiesML || { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };

      // HINDISTON (Hindiston davlati viloyat/shtatlari va tumanlari/shaharlari)
      hindistonCitiesML = data.hindistonCitiesML || { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };

      // MDH davlatlari (faqat davlat nomlari, region/tuman bo'linishi bo'lmagan davlatlar)
      mdhCountriesML = data.mdhCountriesML || { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };
      
      console.log('[Regions] regions.json muvaffaqiyatli yuklandi.');
      return data;
  })
  .catch(err => {
      console.error('[Regions] regions.json yuklanmadi:', err);
      uzbekCitiesML = { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };
      kazakhstanCitiesML = { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };
      kyrgyzstanCitiesML = { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };
      tajikistanCitiesML = { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };
      russiaCitiesML = { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} }; // Xato bo'lsa bo'sh qoldirish
      hindistonCitiesML = { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };
      mdhCountriesML = { uz: {}, ru: {}, en: {}, kk: {}, ky: {}, kaa: {}, tg: {} };
  });
  return _regionsLoadPromise;
  }

  // Sahifa yuklanishida regionlarni yuklab olish
  loadRegionsData();

  // ... keyingi qism ...

  function getUzbekCitiesForLang(lang) {
  // Agar regions.json hali yuklanmagan bo'lsa — bo'sh massiv qaytaradi
  if (!uzbekCitiesML || !kazakhstanCitiesML) return [];

  const uzData = uzbekCitiesML[lang] || uzbekCitiesML['uz'] || {};
  const kzData = kazakhstanCitiesML[lang] || kazakhstanCitiesML['uz'] || {};
  const kgData = kyrgyzstanCitiesML ? (kyrgyzstanCitiesML[lang] || kyrgyzstanCitiesML['uz'] || {}) : {};
  const tjData = tajikistanCitiesML ? (tajikistanCitiesML[lang] || tajikistanCitiesML['uz'] || {}) : {};
  // Yangi qo'shilgan Rossiya ma'lumotlari
  const ruData = russiaCitiesML ? (russiaCitiesML[lang] || russiaCitiesML['uz'] || {}) : {};
  // Hindiston (India) ma'lumotlari
  const inData = hindistonCitiesML ? (hindistonCitiesML[lang] || hindistonCitiesML['uz'] || {}) : {};
  // MDH davlatlari (faqat nomi, region bo'linishisiz)
  const mdhData = mdhCountriesML ? (mdhCountriesML[lang] || mdhCountriesML['uz'] || {}) : {};

  return [
      ...Object.values(uzData).flat(), 
      ...Object.values(kzData).flat(), 
      ...Object.values(kgData).flat(), 
      ...Object.values(tjData).flat(),
      ...Object.values(ruData).flat(), // Rossiya shaharlarini qo'shamiz
      ...Object.values(inData).flat(), // Hindiston shaharlarini qo'shamiz
      ...Object.values(mdhData).flat() // MDH davlatlari nomlarini qo'shamiz
  ];
  }


  // Chat state
  let currentChatMatchId = null;
  let currentChatPartner = null;
  let chatRefreshInterval = null;
  let chatsPollInterval = null;

  // Message target for modal
  let messageTargetUserId = null;
  let messageTargetName = '';
  let messageTargetPhoto = '';

  // ===== LIMIT STATUS =====
  let currentLimitStatus = null;

  async function loadLimitStatus() {
    if (!userId) return;
    try {
      const data = await apiPost('/api/limits/status', { telegram_id: userId });
      if (data.success) {
        currentLimitStatus = data.limits;
        updateLimitBar(data.limits);
      }
    } catch (e) {
      console.error('Limit status load error:', e);
    }
  }

  function updateLimitBar(limits) {
    // Qidiruv bo'limidagi limit-status-bar olib tashlandi — faqat profil bo'limida ko'rsatiladi
    const bar = document.getElementById('limit-status-bar');
    if (bar) bar.style.display = 'none';

    const mpCard = document.getElementById('mp-limit-card');

    // Ayol foydalanuvchilar uchun limit kartochkasi yashiriladi
    if (limits.is_female) {
      if (mpCard) mpCard.style.display = 'none';
      return;
    }

    const likesVal = limits.unlimited ? '∞' : limits.likes_remaining;
    const msgsVal  = limits.unlimited ? '∞' : limits.messages_remaining;
    const slVal    = limits.unlimited ? '∞' : limits.super_likes_remaining;

    // Faqat profil (myprofile) bo'limidagi kartochka
    if (mpCard) {
      mpCard.style.display = 'flex';
      mpCard.classList.toggle('mp-limit-card--unlimited', !!limits.unlimited);
      document.getElementById('mp-limit-likes').textContent = likesVal;
      document.getElementById('mp-limit-messages').textContent = msgsVal;
      document.getElementById('mp-limit-superlikes').textContent = slVal;
    }
  }

  // ===== LIMIT MODAL MATNI (YANGILANGAN) =====
  function showLimitExceeded(type) {
    // Ayol foydalanuvchilar uchun limit modali ko'rsatilmaydi
    if (currentLimitStatus && currentLimitStatus.is_female) return;

    const modal = document.getElementById('limit-modal');
    const text = document.getElementById('limit-modal-text');
    if (modal && text) {
      const messages = {
        'likes': tr('limit_likes_exceeded'),
        'messages': tr('limit_messages_exceeded'),
        'super_likes': tr('limit_super_likes_exceeded')
      };
      text.textContent = messages[type] || tr('limit_exceeded_default');
      modal.style.display = 'flex';
    }
  }

  function closeLimitModal(e) {
    if (e && e.target !== e.currentTarget && e.target !== document.getElementById('limit-modal')) return;
    document.getElementById('limit-modal').style.display = 'none';
  }

  // ===== REFERRAL MODAL (YANGILANGAN - Guruhga odam qo'shish) =====
  function applyGroupInviteLink(groupLink = DEFAULT_GROUP_INVITE_LINK) {
    const linkInput = document.getElementById('referral-link-input');
    const shareLink = document.getElementById('referral-share-link');

    if (linkInput) linkInput.value = groupLink;
    if (shareLink) {
      const text = encodeURIComponent('Tanishuv guruhiga qo\'shiling! Yangi do\'stlarni toping.');
      const url = encodeURIComponent(groupLink);
      shareLink.href = `https://t.me/share/url?url=${url}&text=${text}`;
    }
  }

  async function openReferralModal() {
    closeLimitModal();
    const modal = document.getElementById('referral-modal');
    if (!modal) return;

    applyGroupInviteLink();

    if (userId) {
      try {
        const data = await apiPost('/api/referral/status', { telegram_id: userId });
        if (data.success) {
          const stats = document.getElementById('referral-stats');

          const count = data.referral.group_invite_count || 0;
          const unlimited = data.referral.unlimited_until;
          const invitees = data.referral.group_invitees || [];

          let html = `👥 ${tr('referral_invited_count')}: <strong>${count}</strong> ${tr('count_pcs')}`;
          if (unlimited) {
            html += `<br>✅ ${tr('referral_unlimited_until')}: <strong>${new Date(unlimited).toLocaleDateString('uz-UZ')}</strong> ${tr('until_date')}`;
          }
          if (invitees.length > 0) {
            html += `<br><br>📝 ${tr('referral_recent_invitees')}:<br>`;
            invitees.slice(0, 5).forEach(inv => {
              html += `• ${inv.full_name || tr('no_name')}<br>`;
            });
          }
          if (stats) stats.innerHTML = html;

          // Guruh invite link
          const groupLink = data.referral.referral_link || DEFAULT_GROUP_INVITE_LINK;
          applyGroupInviteLink(groupLink);
        }
      } catch (e) {
        console.error('Referral status error:', e);
        applyGroupInviteLink();
      }
    }

    modal.style.display = 'flex';
  }

  function closeReferralModal(e) {
    if (e && e.target !== e.currentTarget && e.target !== document.getElementById('referral-modal')) return;
    document.getElementById('referral-modal').style.display = 'none';
  }

  function copyReferralLink() {
    const input = document.getElementById('referral-link-input');
    if (input) {
      input.select();
      navigator.clipboard.writeText(input.value).then(() => {
        showToast(tr('link_copied'));
      });
    }
  }

  // ===== MESSAGE MODAL =====
  let messageFromSearch = false;
  function openMessageModal(toUserId, name, photo, canWrite) {
    messageTargetUserId = toUserId;
    messageTargetName = name;
    messageTargetPhoto = photo;
    // 4-parametr: qidiruvdan kelganmi (tinder card'dan)
    messageFromSearch = (canWrite !== undefined) ? true : false;
    document.getElementById('message-modal-sub').textContent = tr('write_message_to').replace('{name}', name || '');
    document.getElementById('first-message-input').value = '';
    document.getElementById('message-modal').style.display = 'flex';
  }

  function closeMessageModal(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('message-modal').style.display = 'none';
    messageTargetUserId = null;
  }

  async function sendFirstMessage() {
    const message = document.getElementById('first-message-input').value.trim();
    const fromUserId = Number(userId);
    const toUserId = Number(messageTargetUserId);
    const savedName = messageTargetName;
    const savedPhoto = messageTargetPhoto;
    const wasFromSearch = messageFromSearch;

    if (!message) {
      showToast(tr('enter_message_text'));
      return;
    }
    if (!Number.isFinite(fromUserId) || fromUserId <= 0) {
      showToast(tr('error_user_id_not_found'));
      return;
    }
    if (!Number.isFinite(toUserId) || toUserId <= 0) {
      showToast(tr('error_recipient_not_found'));
      return;
    }

    // Xabar limit tekshirish
    const limitOk = await checkLimit('messages');
    if (!limitOk) {
      showLimitExceeded('messages');
      closeMessageModal();
      return;
    }

    closeMessageModal();

    // Qidiruvdan kelgan bo'lsa — keyingi anketaga o'tamiz
    if (wasFromSearch) {
      tinderHistory.push(tinderIndex);
      tinderIndex++;
      renderTinderCard('right');
    }

    // 1. Avval like yuboramiz
    const likeData = await apiPost('/api/likes/send', {
      from_user: fromUserId,
      to_user: toUserId
    });

    if (likeData.error === 'limit_exceeded') {
      showLimitExceeded('likes');
      return;
    }

    if (!likeData.success && !likeData.match) {
      showToast(tr('error_prefix') + (likeData.error || tr('like_not_sent')));
      return;
    }

    await loadLimitStatus();

    try { addToViewed({ id: toUserId, name: savedName, photo: savedPhoto }, 'liked'); } catch(e) {}
    try { addToViewed({ id: toUserId, name: savedName, photo: savedPhoto }, 'messaged'); } catch(e) {}

    // 2. Mutual match bo'lsa — xabar yuboramiz va chatni ochamiz
    if (likeData.match && likeData.match_id) {
      const chatData = await apiPost('/api/chat/send', {
        match_id: likeData.match_id,
        sender_id: fromUserId,
        message: message
      });
      if (chatData.success) {
        showToast(tr('message_sent'));
        loadChats();
        openChatRoom(likeData.match_id, savedName, savedPhoto);
      } else {
        showToast('✅ ' + tr('match_subtitle'));
        loadChats();
      }
      return;
    }

    // 3. Bir tomonlama like — like + pending xabar yuborildi, chat OCHILMAYDI
    // Pending xabarni bot orqali yuborish (xabar limiti ishlatildi)
    try {
      await apiPost('/api/messages/send_pending', {
        from_user: fromUserId,
        to_user: toUserId,
        message: message
      });
    } catch(e) {}

    // Lokalda zaxira
    try {
      const pendingKey = 'pending_msg_' + fromUserId + '_' + toUserId;
      localStorage.setItem(pendingKey, JSON.stringify({
        message: message,
        name: savedName,
        photo: savedPhoto,
        toUserId: toUserId,
        timestamp: Date.now()
      }));
    } catch(e) {}

    showToast('💙 ' + tr('like_sent_with_hint'));
  }

  // ===== LIMIT CHECK HELPER =====
  async function checkLimit(type) {
    if (!userId) return false;
    if (!currentLimitStatus) {
      await loadLimitStatus();
    }
    // Ayol foydalanuvchilar uchun hech qanday limit yo'q
    if (currentLimitStatus && (currentLimitStatus.unlimited || currentLimitStatus.is_female)) return true;

    if (currentLimitStatus) {
      if (type === 'likes' && currentLimitStatus.likes_remaining <= 0) return false;
      if (type === 'messages' && currentLimitStatus.messages_remaining <= 0) return false;
      if (type === 'super_likes' && currentLimitStatus.super_likes_remaining <= 0) return false;
    }
    return true;
  }

  async function decrementLocalLimit(type) {
    if (!currentLimitStatus || currentLimitStatus.unlimited) return;
    if (type === 'likes') currentLimitStatus.likes_remaining = Math.max(0, currentLimitStatus.likes_remaining - 1);
    if (type === 'messages') currentLimitStatus.messages_remaining = Math.max(0, currentLimitStatus.messages_remaining - 1);
    if (type === 'super_likes') currentLimitStatus.super_likes_remaining = Math.max(0, currentLimitStatus.super_likes_remaining - 1);
    updateLimitBar(currentLimitStatus);
  }

  // ===== PAGE NAVIGATION =====

  function populateProfileForm(profile) {
    if (!profile) return;

    // Set gender
    if (profile.gender) {
      selectGender(profile.gender);
    }

    // Set text inputs
    const nameInput = document.getElementById('inp-name');
    const ageInput = document.getElementById('inp-age');
    const cityInput = document.getElementById('inp-city');
    const aboutInput = document.getElementById('inp-about');

    if (nameInput && profile.full_name) nameInput.value = profile.full_name;
    if (ageInput && profile.age) ageInput.value = profile.age;
    if (cityInput && profile.city) {
      cityInput.value = profile.city;
      // Region selectorlarni ham to'ldirish
      populateRegionFromCityString(profile.city);
    }
    if (aboutInput && profile.about) aboutInput.value = profile.about;

    // Set zodiac
    if (profile.zodiac) {
      const zodiacSelect = document.getElementById('sel-zodiac');
      if (zodiacSelect) zodiacSelect.value = profile.zodiac;
      syncZodiacPicker();
    }

    // Set interests chips
    if (profile.interests && Array.isArray(profile.interests)) {
      selectedInterests = [...profile.interests];
      document.querySelectorAll('#interests-chips .chip').forEach(chip => {
        const chipKey = chip.getAttribute('data-i18n-chip');
        if (selectedInterests.includes(chipKey)) {
          chip.classList.add('selected');
        }
      });
    }

    // Set goals chips
    if (profile.goals && Array.isArray(profile.goals)) {
      selectedGoals = [...profile.goals];
      document.querySelectorAll('#goals-chips .chip').forEach(chip => {
        const chipKey = chip.getAttribute('data-i18n-chip');
        if (selectedGoals.includes(chipKey)) {
          chip.classList.add('selected');
        }
      });
    }

    // Set photo
    if (profile.photo_base64 || profile.photo_file_id) {
      photoBase64 = profile.photo_base64 || profile.photo_file_id || '';
      photoReady = true;
      photoUploading = false;
      const preview = document.getElementById('photo-preview');
      const uploadIcon = document.getElementById('upload-icon');
      const uploadText = document.getElementById('upload-text');
      const uploadSub = document.getElementById('upload-sub');

      if (preview) {
        preview.src = photoBase64;
        preview.style.display = 'block';
      }
      if (uploadIcon) uploadIcon.style.display = 'none';
      if (uploadText) uploadText.style.display = 'none';
      if (uploadSub) uploadSub.style.display = 'none';
      updatePhotoUploadState(tr('image_ready'), true, false);
    }
  }

  function resetProfileFormState() {
    // Clear all form state so previous user's data doesn't leak
    selectedGender = '';
    selectedInterests = [];
    selectedGoals = [];
    photoBase64 = '';
    photoReady = false;
    photoUploading = false;

    // Clear form inputs
    const nameInput = document.getElementById('inp-name');
    const ageInput = document.getElementById('inp-age');
    const cityInput = document.getElementById('inp-city');
    const aboutInput = document.getElementById('inp-about');
    const zodiacSelect = document.getElementById('sel-zodiac');

    if (nameInput) nameInput.value = '';
    if (ageInput) ageInput.value = '';
    if (cityInput) cityInput.value = '';
    if (aboutInput) aboutInput.value = '';
    if (zodiacSelect) zodiacSelect.value = '';

    // Region selectorlarni tozalash
    const countrySel = document.getElementById('inp-country');
    const regionSel = document.getElementById('inp-region');
    const districtSel = document.getElementById('inp-district');
    if (countrySel) countrySel.value = '';
    if (regionSel) { regionSel.value = ''; regionSel.style.display = 'none'; }
    if (districtSel) { districtSel.value = ''; districtSel.style.display = 'none'; }

    // Clear gender selection visuals
    const maleBtn = document.getElementById('gender-erkak');
    const femaleBtn = document.getElementById('gender-ayol');
    if (maleBtn) maleBtn.classList.remove('selected');
    if (femaleBtn) femaleBtn.classList.remove('selected');

    // Clear chips
    document.querySelectorAll('.chip.selected').forEach(chip => chip.classList.remove('selected'));

    // Clear photo preview
    const preview = document.getElementById('photo-preview');
    const uploadIcon = document.getElementById('upload-icon');
    const uploadText = document.getElementById('upload-text');
    const uploadSub = document.getElementById('upload-sub');

    if (preview) {
      preview.src = '';
      preview.style.display = 'none';
    }
    if (uploadIcon) uploadIcon.style.display = 'inline-flex';
    if (uploadText) uploadText.style.display = 'inline';
    if (uploadSub) uploadSub.style.display = 'inline';

    // Reset upload status
    updatePhotoUploadState('Rasm yuklangandan so\'ng saqlash mumkin.', false, false);
  }

  // Profil to'liq to'ldirilganligini tekshirish
  function isProfileComplete(user) {
    if (!user) return false;
    return !!(
      user.gender &&
      user.full_name &&
      user.age &&
      user.city &&
      (user.photo_base64 || user.photo_file_id) &&
      user.goals && Array.isArray(user.goals) && user.goals.length > 0
    );
  }

  function showPage(name) {
      console.log('Showing page:', name, 'Current language:', currentLang);
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const pageEl = document.getElementById('page-' + name);
    if (pageEl) pageEl.classList.add('active');

    const navBtn = document.getElementById('nav-' + name);
    if (navBtn) navBtn.classList.add('active');

    if (name === 'search') {
      setDefaultSearchGender();
      syncSearchZodiacPicker();
      loadPendingLikesIndicator();
      loadLimitStatus();
    }
    if (name === 'myprofile') loadMyProfile();
    if (name === 'chats') loadChats();
    if (name === 'viewed') loadViewed();
    if (name === 'profile') {
      // CRITICAL: Reset form state when entering profile page
      // so previous user's data doesn't appear
      resetProfileFormState();
      // Then load existing profile if available for CURRENT user
      const existing = getProfile();
      if (existing) {
        populateProfileForm(existing);
      }
    }

    syncZodiacPicker();
  }

  // ===== ADVANCED FILTERS TOGGLE =====
  function toggleAdvancedFilters() {
    const el = document.getElementById('advanced-filters');
    const btnText = document.getElementById('adv-filter-btn-text');
    if (el) {
      const showing = el.style.display !== 'none';
      el.style.display = showing ? 'none' : 'block';
      if (btnText) btnText.textContent = showing ? tr('advanced_filters') : tr('close_filters');
    }
  }

  // ===== SEARCH =====
  function selectGender(g) {
    selectedGender = g;
    document.getElementById('gender-erkak').classList.toggle('selected', g === 'erkak');
    document.getElementById('gender-ayol').classList.toggle('selected', g === 'ayol');
  }

  function getOppositeGender(g) {
    return g === 'erkak' ? 'ayol' : g === 'ayol' ? 'erkak' : '';
  }

  function selectSearchGender(g) {
    selectedSearchGender = g;
    document.getElementById('sf-gender-erkak').classList.toggle('selected', g === 'erkak');
    document.getElementById('sf-gender-ayol').classList.toggle('selected', g === 'ayol');
  }

  function setDefaultSearchGender() {
    const profile = getProfile();
    const opposite = profile ? getOppositeGender(profile.gender) : '';
    if (opposite) selectSearchGender(opposite);
  }

  // ===== CHIP TOGGLE =====
  function toggleChip(el, group) {
      el.classList.toggle('selected');
      const value = el.getAttribute('data-i18n-chip') || el.textContent.trim();

    if (group === 'interests') {
      if (el.classList.contains('selected')) {
        if (selectedInterests.length >= MAX_INTERESTS_ALLOWED) {
          el.classList.remove('selected');
          showToast(tr('max_interests_hint'));
          return;
        }
        selectedInterests = Array.from(new Set([...selectedInterests, value]));
      } else {
        selectedInterests = selectedInterests.filter(i => i !== value);
      }
    } else if (group === 'goals') {
      if (el.classList.contains('selected')) selectedGoals.push(value);
      else selectedGoals = selectedGoals.filter(i => i !== value);
    } else if (group === 'sf-goals') {
      if (el.classList.contains('selected')) selectedSearchGoals.push(value);
      else selectedSearchGoals = selectedSearchGoals.filter(i => i !== value);
    } else if (group === 'sf-interests') {
      if (el.classList.contains('selected')) selectedSearchInterests.push(value);
      else selectedSearchInterests = selectedSearchInterests.filter(i => i !== value);
    }
  }

  // overlay-root: backdrop-filter yo'q, hech narsa ustida
  function getOverlayRoot() {
    let root = document.getElementById('overlay-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'overlay-root';
      root.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;';
      document.body.appendChild(root);
    }
    return root;
  }

  // Panel ni overlay-root ga ko'chirib, trigger yoniga joylash
  function positionPanel(menu, trigger) {
    if (!menu || !trigger) return;

    // overlay-root ga ko'chirish (backdrop-filter stacking muammosidan xalos)
    const root = getOverlayRoot();
    if (menu.parentElement !== root) {
      root.appendChild(menu);
    }

    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const panelW = Math.min(Math.max(rect.width, 200), vw - 24);
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;

    menu.style.position = 'fixed';
    menu.style.zIndex = '2147483647';
    menu.style.pointerEvents = 'auto';
    menu.style.width = panelW + 'px';
    menu.style.left = Math.max(12, Math.min(rect.left, vw - panelW - 12)) + 'px';

    const MIN_HEIGHT = 180;
    if (spaceBelow >= MIN_HEIGHT || spaceBelow >= spaceAbove) {
      // Pastga oching
      const maxH = Math.min(320, Math.max(MIN_HEIGHT, spaceBelow - 12));
      menu.style.top = (rect.bottom + 4) + 'px';
      menu.style.bottom = 'auto';
      menu.style.maxHeight = maxH + 'px';
    } else {
      // Tepaga oching
      const maxH = Math.min(320, Math.max(MIN_HEIGHT, spaceAbove - 12));
      menu.style.top = 'auto';
      menu.style.bottom = (vh - rect.top + 4) + 'px';
      menu.style.maxHeight = maxH + 'px';
    }
    menu.style.overflowY = 'auto';
  }

  function toggleZodiacMenu() {
    const menu = document.getElementById('zodiac-options');
    const trigger = document.getElementById('zodiac-picker-toggle');
    if (!menu) return;

    const isOpen = menu.style.display !== 'none' && menu.style.display !== '';
    if (isOpen) {
      menu.style.display = 'none';
    } else {
      if (menu.parentElement !== document.body) document.body.appendChild(menu);
      menu.style.display = 'grid';
      positionPanel(menu, trigger);
    }
  }

  function syncZodiacPicker() {
    const select = document.getElementById('sel-zodiac');
    const button = document.getElementById('zodiac-picker-toggle');
    if (!select || !button) return;

    const value = select.value?.trim();
    document.querySelectorAll('.zodiac-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.zodiac === value);
    });
    button.classList.toggle('selected', !!value);
    
    if (value) {
      button.textContent = getZodiacDisplay(value);
    } else {
      button.textContent = tr('zodiac_select_btn');
    }
  }

  function selectZodiac(value, label) {
    const select = document.getElementById('sel-zodiac');
    const button = document.getElementById('zodiac-picker-toggle');
    const menu = document.getElementById('zodiac-options');

    if (select) {
      select.value = value;
    }
    if (button) {
      button.textContent = value ? getZodiacDisplay(value) : tr('zodiac_select_btn');
      button.classList.toggle('selected', !!value);
    }
    document.querySelectorAll('.zodiac-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.zodiac === value);
    });
    if (menu) {
      menu.style.display = 'none';
    }
  }

  function toggleSearchZodiacMenu() {
    const menu = document.getElementById('sf-zodiac-options');
    const trigger = document.getElementById('sf-zodiac-toggle');
    if (!menu) return;

    const isOpen = menu.style.display !== 'none' && menu.style.display !== '';
    if (isOpen) {
      menu.style.display = 'none';
    } else {
      if (menu.parentElement !== document.body) document.body.appendChild(menu);
      menu.style.display = 'grid';
      positionPanel(menu, trigger);
    }
  }

  function syncSearchZodiacPicker() {
    const select = document.getElementById('sf-zodiac');
    const button = document.getElementById('sf-zodiac-toggle');
    if (!select || !button) return;

    const value = select.value?.trim() || '';
    document.querySelectorAll('#sf-zodiac-options .zodiac-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.zodiac === value);
    });

    if (value) {
      button.textContent = getZodiacDisplay(value);
    } else {
      button.textContent = tr('all_zodiacs');
    }
    button.classList.toggle('selected', !!value);
  }

  function selectSearchZodiac(value, label) {
    const select = document.getElementById('sf-zodiac');
    const button = document.getElementById('sf-zodiac-toggle');
    const menu = document.getElementById('sf-zodiac-options');

    if (select) select.value = value;
    if (button) {
      button.textContent = value ? getZodiacDisplay(value) : tr('all_zodiacs');
      button.classList.toggle('selected', !!value);
    }

    document.querySelectorAll('#sf-zodiac-options .zodiac-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.zodiac === value);
    });

    if (menu) menu.style.display = 'none';
  }

  // ========== BURJ NOMLARI VA MOSLIK MA'LUMOTLARI ==========
  const ZODIAC_SIGNS = {
    "qoy": ("Qo'y", "♈"),
    "buzoq": ("Buzoq", "♉"),
    "egizak": ("Egizak", "♊"),
    "qisqichbaqa": ("Qisqichbaqa", "♋"),
    "arslon": ("Arslon", "♌"),
    "sunbula": ("Sunbula", "♍"),
    "tarozi": ("Tarozi", "♎"),
    "chayon": ("Chayon", "♏"),
    "oqotar": ("O'qotar", "♐"),
    "tog_echkisi": ("Tog' echkisi", "♑"),
    "qovga": ("Qovg'a", "♒"),
    "baliq": ("Baliq", "♓"),
  };

  const ZODIAC_COMPATIBILITY = {
    "qoy": {
      "mos": ["arslon", "egizak", "oqotar"],
      "qiyin": ["qisqichbaqa", "chayon", "baliq"]
    },
    "buzoq": {
      "mos": ["sunbula", "qisqichbaqa", "tog_echkisi"],
      "qiyin": ["egizak", "oqotar", "qovga"]
    },
    "egizak": {
      "mos": ["qoy", "tarozi", "qovga"],
      "qiyin": ["buzoq", "chayon", "tog_echkisi"]
    },
    "qisqichbaqa": {
      "mos": ["buzoq", "baliq", "chayon"],
      "qiyin": ["qoy", "egizak", "oqotar"]
    },
    "arslon": {
      "mos": ["qoy", "egizak", "tarozi"],
      "qiyin": ["buzoq", "tog_echkisi", "baliq"]
    },
    "sunbula": {
      "mos": ["buzoq", "tog_echkisi", "chayon"],
      "qiyin": ["egizak", "arslon", "oqotar"]
    },
    "tarozi": {
      "mos": ["egizak", "arslon", "qovga"],
      "qiyin": ["chayon", "qisqichbaqa", "tog_echkisi"]
    },
    "chayon": {
      "mos": ["qisqichbaqa", "baliq", "buzoq"],
      "qiyin": ["egizak", "qoy", "tarozi"]
    },
    "oqotar": {
      "mos": ["qoy", "arslon", "qovga"],
      "qiyin": ["buzoq", "qisqichbaqa", "tog_echkisi"]
    },
    "tog_echkisi": {
      "mos": ["buzoq", "sunbula", "chayon"],
      "qiyin": ["egizak", "tarozi", "oqotar"]
    },
    "qovga": {
      "mos": ["oqotar", "egizak", "tarozi"],
      "qiyin": ["buzoq", "chayon", "qisqichbaqa"]
    },
    "baliq": {
      "mos": ["buzoq", "qisqichbaqa", "chayon"],
      "qiyin": ["qoy", "egizak", "arslon"]
    }
  };

  function normalizeZodiacKey(value) {
    if (!value) return null;

    const text = String(value)
      .normalize('NFKC')
      .replace(/[♈♉♊♋♌♍♎♏♐♑♒♓]/g, '')
      .replace(/[’'`]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const aliases = {
      // Uzbek
      'qoy': 'qoy', 'qo y': 'qoy', 'aries': 'qoy',
      'buzoq': 'buzoq', 'buqa': 'buzoq', 'taurus': 'buzoq',
      'egizak': 'egizak', 'egizaklar': 'egizak', 'gemini': 'egizak',
      'qisqichbaqa': 'qisqichbaqa', 'cancer': 'qisqichbaqa',
      'arslon': 'arslon', 'sher': 'arslon', 'leo': 'arslon',
      'sunbula': 'sunbula', 'qiz': 'sunbula', 'virgo': 'sunbula',
      'tarozi': 'tarozi', 'libra': 'tarozi',
      'chayon': 'chayon', 'chayonlar': 'chayon', 'scorpio': 'chayon',
      'oqotar': 'oqotar', 'o qotar': 'oqotar', 'yoy': 'oqotar', 'sagittarius': 'oqotar',
      'tog echkisi': 'tog_echkisi', 'tog echkisi': 'tog_echkisi', 'capricorn': 'tog_echkisi',
      'qovga': 'qovga', 'qovg a': 'qovga', 'qovunchi': 'qovga', 'aquarius': 'qovga',
      'baliq': 'baliq', 'pisces': 'baliq',
      // Russian (ru)
      'овен': 'qoy', 'телец': 'buzoq', 'близнецы': 'egizak',
      'рак': 'qisqichbaqa', 'лев': 'arslon', 'дева': 'sunbula',
      'весы': 'tarozi', 'скорпион': 'chayon', 'стрелец': 'oqotar',
      'козерог': 'tog_echkisi', 'водолей': 'qovga', 'рыбы': 'baliq',
      // Kazakh (kk)
      'қой': 'qoy', 'бұқа': 'buzoq', 'егіздер': 'egizak',
      'шаян': 'qisqichbaqa', 'арыстан': 'arslon', 'бикеш': 'sunbula',
      'таразы': 'tarozi', 'скорпион': 'chayon', 'мерген': 'oqotar',
      'ешкімүйіз': 'tog_echkisi', 'су құйғыш': 'qovga', 'балық': 'baliq',
      // Kyrgyz (ky)
      'кой': 'qoy', 'бука': 'buzoq', 'эгиздер': 'egizak',
      'чаян': 'qisqichbaqa', 'арстан': 'arslon', 'башак': 'sunbula',
      'тараза': 'tarozi', 'чаяндар': 'chayon', 'мерген': 'oqotar',
      'теке': 'tog_echkisi', 'суу куюучу': 'qovga', 'балыктар': 'baliq',
      // Karakalpak (kaa)
      'qoy': 'qoy', 'buqa': 'buzoq', 'egizler': 'egizak',
      'shayan': 'qisqichbaqa', 'arıslan': 'arslon', 'sunbile': 'sunbula',
      'tarazi': 'tarozi', 'şayon': 'chayon', 'mergen': 'oqotar',
      'uwıl şal': 'tog_echkisi', 'quwba': 'qovga', 'balıq': 'baliq',
      // Tajik (tg)
      'ҳамал': 'qoy', 'савр': 'buzoq', 'ҷавзо': 'egizak',
      'саратон': 'qisqichbaqa', 'асад': 'arslon', 'сунбула': 'sunbula',
      'мезон': 'tarozi', 'ақраб': 'chayon', 'қавс': 'oqotar',
      'ҷадй': 'tog_echkisi', 'далв': 'qovga', 'ҳут': 'baliq',
    };

    return aliases[text] || text.replace(/\s*\([^)]*\)\s*$/, '');
  }

  function getZodiacDisplay(zodiacValue) {
    if (!zodiacValue) return '';
    const normalized = normalizeZodiacKey(zodiacValue);
    const keyMap = {
      'qoy': 'zod_qoy', 'buzoq': 'zod_buzoq', 'egizak': 'zod_egizak',
      'qisqichbaqa': 'zod_qisqichbaqa', 'arslon': 'zod_arslon',
      'sunbula': 'zod_sunbula', 'tarozi': 'zod_tarozi',
      'chayon': 'zod_chayon', 'oqotar': 'zod_oqotar',
      'tog_echkisi': 'zod_tog_echkisi', 'qovga': 'zod_qovga',
      'baliq': 'zod_baliq'
    };
    const emojiMap = {
      'qoy': '♈', 'buzoq': '♉', 'egizak': '♊', 'qisqichbaqa': '♋',
      'arslon': '♌', 'sunbula': '♍', 'tarozi': '♎', 'chayon': '♏',
      'oqotar': '♐', 'tog_echkisi': '♑', 'qovga': '♒', 'baliq': '♓'
    };
    const key = keyMap[normalized];
    if (!key) return zodiacValue;
    return emojiMap[normalized] + ' ' + tr(key);
  }

  // Foydalanuvchining burjini olish
  function getMyZodiac() {
    const profile = getProfile();
    if (!profile?.zodiac) return null;

    const key = normalizeZodiacKey(profile.zodiac);
    return ZODIAC_COMPATIBILITY[key] ? key : null;
  }

  // Burjga mos kelish statusini tekshirish
  function getZodiacCompatStatus(myZodiac, theirZodiac) {
    if (!myZodiac || !theirZodiac) return null;

    const myKey = normalizeZodiacKey(myZodiac);
    const theirKey = normalizeZodiacKey(theirZodiac);
    const compat = ZODIAC_COMPATIBILITY[myKey];

    if (!compat || !theirKey) return null;
    if (compat.mos.includes(theirKey)) return 'mos';
    if (compat.qiyin.includes(theirKey)) return 'qiyin';

    return 'neytral';
  }
  let cocoSsdModel = null;
  let cocoSsdLoadPromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = () => reject(new Error(tr('script_load_failed').replace('{src}', src)));
      document.head.appendChild(script);
    });
  }

  function waitForGlobal(name, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (typeof window[name] !== 'undefined' && window[name]) {
          resolve();
        } else if (Date.now() - start > timeoutMs) {
          reject(new Error(tr('wait_timeout').replace('{name}', name)));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  async function ensureCocoSsdModel() {
    if (cocoSsdModel) return cocoSsdModel;
    if (cocoSsdLoadPromise) return cocoSsdLoadPromise;

    cocoSsdLoadPromise = (async () => {
      if (typeof tf === 'undefined') {
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js');
      }
      if (typeof cocoSsd === 'undefined') {
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js');
      }
      await waitForGlobal('cocoSsd', 15000);
      cocoSsdModel = await cocoSsd.load();
      return cocoSsdModel;
    })();

    return cocoSsdLoadPromise;
  }

  async function detectPersonCocoSsd(file) {
    const model = await ensureCocoSsdModel();
    const url = URL.createObjectURL(file);
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(tr('image_load_failed')));
      image.src = url;
    });
    try {
      const predictions = await model.detect(img);
      return predictions.some(p => p.class === 'person' && p.score >= 0.25);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function updatePhotoUploadState(message, ready = false, uploading = photoUploading) {
    const status = document.getElementById('upload-status');
    const area = document.getElementById('photo-upload-area');
    const saveBtn = document.getElementById('save-profile-btn');
    if (status) status.textContent = message;
    if (area) {
      area.classList.toggle('photo-ready', ready);
      area.classList.toggle('photo-uploading', uploading);
    }
    if (saveBtn) {
      const canSave = Boolean(photoReady && photoBase64 && !uploading);
      saveBtn.disabled = !canSave;
    }
  }

  function restoreExistingPhotoState() {
    // CRITICAL: Only restore photo for the CURRENT user, not any cached data
    const existing = getProfile();
    if (existing?.photo_base64 || existing?.photo_file_id) {
      // Verify this profile belongs to current user before restoring
      const currentUserId = userId || getSessionId();
      const profileUserId = existing.telegram_id;
      if (profileUserId && userId && profileUserId !== userId) {
        // Profile belongs to different user — don't restore!
        console.warn('Photo state blocked: profile belongs to different user');
        return;
      }
      photoBase64 = existing.photo_base64 || existing.photo_file_id || '';
      photoReady = true;
      photoUploading = false;
      const preview = document.getElementById('photo-preview');
      if (preview) {
        preview.src = photoBase64;
        preview.style.display = 'block';
      }
      document.getElementById('upload-icon')?.style.setProperty('display', 'none');
      document.getElementById('upload-text')?.style.setProperty('display', 'none');
      document.getElementById('upload-sub')?.style.setProperty('display', 'none');
      updatePhotoUploadState(tr('image_ready'), true, false);
    }
  }

  function proceedWithPhotoPreview(file) {
    photoUploading = true;
    updatePhotoUploadState(tr('uploading_image'), false, true);
    const reader = new FileReader();
    reader.onload = (e) => {
      photoBase64 = e.target.result;
      const preview = document.getElementById('photo-preview');
      const uploadText = document.getElementById('upload-text');
      const uploadSub = document.getElementById('upload-sub');
      const uploadIcon = document.getElementById('upload-icon');
      if (preview) {
        preview.src = photoBase64;
        preview.style.display = 'block';
      }
      if (uploadIcon) uploadIcon.style.display = 'none';
      if (uploadText) uploadText.style.display = 'none';
      if (uploadSub) uploadSub.style.display = 'none';
      photoReady = true;
      photoUploading = false;
      updatePhotoUploadState(tr('image_uploaded_success'), true, false);
    };
    reader.onerror = () => {
      photoReady = false;
      photoUploading = false;
      updatePhotoUploadState(tr('image_read_error'), false, false);
      showToast(tr('image_read_error'));
    };
    reader.readAsDataURL(file);
  }

  // === PHOTO PREVIEW ===
  async function previewPhoto(input) {
    const file = input.files[0];
    if (!file) return;
    photoBase64 = '';
    photoReady = false;
    photoUploading = true;
    updatePhotoUploadState(tr('checking_image'), false, true);
    if (!file.type.startsWith('image/')) {
      showToast(tr('images_only'));
      input.value = '';
      photoBase64 = '';
      photoReady = false;
      photoUploading = false;
      updatePhotoUploadState(tr('images_only_error'), false, false);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast(tr('image_too_large'));
      input.value = '';
      photoBase64 = '';
      photoReady = false;
      photoUploading = false;
      updatePhotoUploadState(tr('image_size_error'), false, false);
      return;
    }

    let faceDetected = false;
    if (window.isSecureContext && 'FaceDetector' in window && typeof FaceDetector === 'function') {
      try {
        const bitmap = await createImageBitmap(file);
        const detector = new FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
        const faces = await detector.detect(bitmap);
        faceDetected = faces.length > 0;
      } catch (error) {
        console.warn('FaceDetector xatolik:', error);
      }
    }

    if (faceDetected) {
      updatePhotoUploadState(tr('face_detected'), false);
      proceedWithPhotoPreview(file);
      return;
    }

    showToast(tr('checking_image_short'), 12000);
    try {
      const personDetected = await detectPersonCocoSsd(file);
      if (personDetected) {
        updatePhotoUploadState(tr('person_confirmed_uploading'), false);
        proceedWithPhotoPreview(file);
      } else {
        showToast(tr('no_person_in_image'));
        input.value = '';
        photoBase64 = '';
        photoReady = false;
        photoUploading = false;
        updatePhotoUploadState(tr('no_person_error'), false, false);
      }
    } catch (err) {
      console.error('COCO-SSD tekshiruvi xatolik:', err);
      showToast(tr('image_check_error'));
      input.value = '';
      photoBase64 = '';
      photoReady = false;
      photoUploading = false;
      updatePhotoUploadState(tr('check_error_inet'), false, false);
    }
  }

  // ========== REGION SELECTOR FUNCTIONS ==========
  // O'zbekiston viloyatlari va tumanlari (regions.json dan)
  // Joriy til uchun viloyatlar qaytaradi
  function getUzbekRegions() {
    if (!uzbekCitiesML) return {};
    const lang = currentLang || 'uz';
    return uzbekCitiesML[lang] || uzbekCitiesML['uz'] || {};
  }

  // O'zbekcha nom → joriy tildagi nom
  function translateRegionName(name) {
    if (!name) return name;
    const lang = currentLang || 'uz';
    // Avval _translateGenericRegion orqali barcha datasetlardan qidirish
    const t = _translateGenericRegion(name, lang);
    return t || name;
  }

  // O'zbekcha tuman nomi → joriy tildagi tuman nomi
  function translateDistrictName(uzRegion, uzDistrict) {
    if (!uzbekCitiesML || !uzRegion || !uzDistrict) return uzDistrict;
    const lang = currentLang || 'uz';
    if (lang === 'uz') return uzDistrict;
    const uzKeys = Object.keys(uzbekCitiesML['uz'] || {});
    const langKeys = Object.keys(uzbekCitiesML[lang] || {});
    const idx = uzKeys.indexOf(uzRegion);
    if (idx === -1 || !langKeys[idx]) return uzDistrict;
    const uzDistricts = uzbekCitiesML['uz'][uzRegion] || [];
    const langDistricts = uzbekCitiesML[lang][langKeys[idx]] || [];
    const dIdx = uzDistricts.indexOf(uzDistrict);
    if (dIdx !== -1 && langDistricts[dIdx]) return langDistricts[dIdx];
    return uzDistrict;
  }

  // city maydoni (o'zbekcha) → joriy tilda chiroyli ko'rsatish
  // city formati: "Tuman, Viloyat" yoki "Viloyat" yoki "Davlat"
  // city maydoni → joriy tilda chiroyli ko'rsatish
  // city yangi formati: "district||region||country"
  // Eski format ham ishlaydi: "Tuman, Viloyat" yoki "Viloyat" yoki "Davlat"
  function translateCityLabel(city = '') {
    if (!city) return city;
    const lang = currentLang || 'uz';

    // ── Yangi format: "district||region||country" ──
    if (city.includes('||')) {
      const [district, region, country] = city.split('||').map(s => s.trim());
      return _buildLocationString(country, region, district, lang);
    }

    // ── Eski format fallback ──
    const parts = city.split(',').map(s => s.trim());
    if (parts.length === 2) {
      const [district, region] = parts;
      if (uzbekCitiesML) {
        const t = _translateUzPart(district, region, lang);
        if (t) return t;
      }
      return _translateGenericDistrict(district, lang) + ', ' + _translateGenericRegion(region, lang);
    } else {
      const single = parts[0];
      const cT = _translateCountryValue(single, lang);
      if (cT !== single) return cT;
      if (uzbekCitiesML) {
        const t = _translateUzRegionOnly(single, lang);
        if (t) return t;
      }
      return _translateGenericRegion(single, lang);
    }
  }

  // Davlat value (istalgan tilda) → joriy tilda nom
  function _translateCountryValue(value, lang) {
    if (!value) return value;
    const MAP = {
      // O'zbekiston
      "Oʻzbekiston": 'country_uz', "O'zbekiston": 'country_uz',
      "Ўzbekiston": 'country_uz', "Узбекистан": 'country_uz',
      "Uzbekistan": 'country_uz', "Өзбекстан": 'country_uz',
      "Ӥзбекистон": 'country_uz', "O'zbekstan": 'country_uz',
      // Rossiya
      "Rossiya": 'country_ru', "Россия": 'country_ru',
      "Russia": 'country_ru', "Ресей": 'country_ru',
      "Русия": 'country_ru',
      // Qozog'iston
      "Qozogʻiston": 'country_kz', "Qozog'iston": 'country_kz',
      "Казахстан": 'country_kz',
      "Kazakhstan": 'country_kz', "Қазақстан": 'country_kz',
      "Qazaqstan": 'country_kz', "Қазоқистон": 'country_kz',
      // Qirg'iziston
      "Qirgʻiziston": 'country_kg', "Qirg'iziston": 'country_kg',
      "Кыргызстан": 'country_kg',
      "Kyrgyzstan": 'country_kg', "Қырғызстан": 'country_kg',
      "Қирғизистон": 'country_kg',
      // Tojikiston
      "Tojikiston": 'country_tj', "Таджикистан": 'country_tj',
      "Tajikistan": 'country_tj', "Тәжікстан": 'country_tj',
      "Тажикстан": 'country_tj',
      "Тоҷикистон": 'country_tj',
      // Turkmaniston
      "Turkmaniston": 'country_tm', "Туркменистан": 'country_tm',
      "Turkmenistan": 'country_tm', "Түркіменстан": 'country_tm',
      "Түркмөнстан": 'country_tm',
      "Туркманистон": 'country_tm',
      // Ozarbayjon
      "Ozarbayjon": 'country_az', "Азербайджан": 'country_az',
      "Azerbaijan": 'country_az', "Әзербайжан": 'country_az',
      "Озарбойҷон": 'country_az',
      // Armaniston
      "Armaniston": 'country_am', "Армения": 'country_am',
      "Armenia": 'country_am', "Armeniya": 'country_am',
      "Арманистон": 'country_am',
      // Gruziya
      "Gruziya": 'country_ge', "Грузия": 'country_ge',
      "Georgia": 'country_ge', "Гурҷистон": 'country_ge',
      // Ukraina
      "Ukraina": 'country_ua', "Украина": 'country_ua',
      "Ukraine": 'country_ua',
      // Belarus
      "Belarus": 'country_by', "Беларусь": 'country_by',
      "Беларус": 'country_by',
      // Moldova
      "Moldova": 'country_md', "Молдова": 'country_md',
      // Boshqa
      "Boshqa": 'country_other', "Другое": 'country_other',
      "Other": 'country_other', "Басқа": 'country_other',
      "Башка": 'country_other', "Basqa": 'country_other',
      "Дигар": 'country_other',
    };
    const key = MAP[value] || MAP[value?.trim()];
    return key ? (tr(key) || value) : value;
  }

  // Dataset bo'yicha viloyatni tarjima qilish (barcha davlatlar)
  function _translateGenericRegion(regionName, lang) {
    if (!regionName) return regionName;
    const datasets = [
      uzbekCitiesML, kazakhstanCitiesML, kyrgyzstanCitiesML,
      tajikistanCitiesML, russiaCitiesML, hindistonCitiesML
    ].filter(Boolean);
    for (const ds of datasets) {
      for (const [srcLang, regions] of Object.entries(ds)) {
        if (!regions || typeof regions !== 'object') continue;
        const keys = Object.keys(regions);
        const idx = keys.indexOf(regionName);
        if (idx !== -1) {
          const targetKeys = Object.keys(ds[lang] || ds['uz'] || ds[srcLang] || {});
          if (targetKeys[idx]) return targetKeys[idx];
        }
      }
    }
    return regionName;
  }

  // Dataset bo'yicha tumanni tarjima qilish
  function _translateGenericDistrict(districtName, lang) {
    if (!districtName) return districtName;
    const datasets = [
      uzbekCitiesML, kazakhstanCitiesML, kyrgyzstanCitiesML,
      tajikistanCitiesML, russiaCitiesML, hindistonCitiesML
    ].filter(Boolean);
    for (const ds of datasets) {
      for (const [srcLang, regions] of Object.entries(ds)) {
        if (!regions || typeof regions !== 'object') continue;
        const regionKeys = Object.keys(regions);
        for (let ri = 0; ri < regionKeys.length; ri++) {
          const districts = regions[regionKeys[ri]] || [];
          const di = districts.indexOf(districtName);
          if (di !== -1) {
            const targetRegions = ds[lang] || ds['uz'] || {};
            const targetRegionKeys = Object.keys(targetRegions);
            if (targetRegionKeys[ri]) {
              const targetDistricts = targetRegions[targetRegionKeys[ri]] || [];
              if (targetDistricts[di]) return targetDistricts[di];
            }
          }
        }
      }
    }
    return districtName;
  }

  // O'zbekiston: viloyat + tuman tarjima
  function _translateUzPart(district, region, lang) {
    if (!uzbekCitiesML) return null;
    if (lang === 'uz') return district + ', ' + region;
    const uzRegions = uzbekCitiesML['uz'] || {};
    const langRegions = uzbekCitiesML[lang] || {};
    const uzKeys = Object.keys(uzRegions);
    const langKeys = Object.keys(langRegions);
    const idx = uzKeys.indexOf(region);
    if (idx === -1) return null;
    const translatedRegion = langKeys[idx] || region;
    const uzDistricts = uzRegions[region] || [];
    const langDistricts = langRegions[langKeys[idx]] || [];
    const di = uzDistricts.indexOf(district);
    const translatedDistrict = di !== -1 && langDistricts[di] ? langDistricts[di] : _translateGenericDistrict(district, lang);
    return translatedDistrict + ', ' + translatedRegion;
  }

  // O'zbekiston: faqat viloyat tarjima
  function _translateUzRegionOnly(name, lang) {
    if (!uzbekCitiesML) return null;
    if (lang === 'uz') return name;
    const uzKeys = Object.keys(uzbekCitiesML['uz'] || {});
    const langKeys = Object.keys(uzbekCitiesML[lang] || {});
    const idx = uzKeys.indexOf(name);
    if (idx !== -1 && langKeys[idx]) return langKeys[idx];
    return null;
  }

  // Asosiy builder: davlat + viloyat + tuman → joriy tilda
  function _buildLocationString(country, region, district, lang) {
    const districtStr = district ? (_translateGenericDistrict(district, lang) || district) : '';
    const regionStr   = region   ? (_translateGenericRegion(region, lang)     || region)   : '';
    const countryStr  = country  ? (_translateCountryValue(country, lang)      || country)  : '';
    // Ko'rsatish tartibi: Tuman, Viloyat, Davlat
    const parts = [districtStr, regionStr, countryStr].filter(Boolean);
    return parts.join(', ');
  }

  function populateRegions(selectId, regions) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const firstOpt = sel.options[0];
    sel.innerHTML = '';
    sel.appendChild(firstOpt);
    Object.keys(regions).forEach(region => {
      const opt = document.createElement('option');
      opt.value = region;
      opt.textContent = region;
      sel.appendChild(opt);
    });
  }

  function populateDistricts(selectId, districts) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const firstOpt = sel.options[0];
    sel.innerHTML = '';
    sel.appendChild(firstOpt);
    (districts || []).forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      sel.appendChild(opt);
    });
  }

  function updateHiddenCityField(fieldId, country, region, district) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    // Format: "district||region||country" — barcha davlatlar uchun bir xil
    // Bu format translateCityLabel da parse qilinadi
    const parts = [district || '', region || '', country || ''].join('||');
    el.value = parts;
  }

  // ═══════════════════════════════════════════════════════════════════
  // CUSTOM LOCATION DROPDOWN ENGINE
  // ═══════════════════════════════════════════════════════════════════

  // Barcha ochiq dropdownlarni yopish
  function closeAllLocDropdowns(exceptId) {
    document.querySelectorAll('.loc-dropdown.open').forEach(d => {
      if (d.id !== exceptId) d.classList.remove('open');
    });
    document.querySelectorAll('.loc-trigger.open').forEach(t => {
      if (t.dataset.for !== exceptId) t.classList.remove('open');
    });
  }

  // Dropdown ochish/yopish
  function positionLocDropdown(trigger, dropdown) {
    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Eni trigger bilan teng, lekin viewport'dan chiqmasin
    const panelW = Math.min(rect.width, viewportWidth - 24);
    let leftPos = Math.max(12, Math.min(rect.left, viewportWidth - panelW - 12));

    dropdown.style.left = leftPos + 'px';
    dropdown.style.width = panelW + 'px';
    dropdown.style.right = 'auto';

    // Qayerga ochish: pastga yoki tepaga?
    const MIN_HEIGHT = 180; // minimum foydali balandlik
    const preferBelow = spaceBelow >= MIN_HEIGHT || spaceBelow >= spaceAbove;

    if (preferBelow) {
      // Pastga oching
      const availH = Math.max(MIN_HEIGHT, spaceBelow - 12);
      const maxH = Math.min(300, availH);
      dropdown.style.top = (rect.bottom + 4) + 'px';
      dropdown.style.bottom = 'auto';
      dropdown.style.maxHeight = maxH + 'px';
    } else {
      // Tepaga oching
      const availH = Math.max(MIN_HEIGHT, spaceAbove - 12);
      const maxH = Math.min(300, availH);
      dropdown.style.top = 'auto';
      dropdown.style.bottom = (viewportHeight - rect.top + 4) + 'px';
      dropdown.style.maxHeight = maxH + 'px';
    }

    // Har holda ekran chegarasidan chiqmasin (clamp)
    requestAnimationFrame(() => {
      const ddRect = dropdown.getBoundingClientRect();
      if (ddRect.bottom > viewportHeight - 8) {
        const overflow = ddRect.bottom - (viewportHeight - 8);
        const curTop = parseFloat(dropdown.style.top) || 0;
        if (dropdown.style.bottom === 'auto') {
          dropdown.style.top = Math.max(8, curTop - overflow) + 'px';
        }
      }
      if (ddRect.top < 8) {
        if (dropdown.style.bottom !== 'auto') {
          const curBottom = parseFloat(dropdown.style.bottom) || 0;
          dropdown.style.bottom = Math.max(8, curBottom - (8 - ddRect.top)) + 'px';
        }
      }
    });
  }

  function toggleLocDropdown(triggerId, dropdownId) {
    const trigger = document.getElementById(triggerId);
    const dropdown = document.getElementById(dropdownId);
    if (!trigger || !dropdown) return;
    const isOpen = dropdown.classList.contains('open');
    closeAllLocDropdowns(dropdownId);
    if (!isOpen) {
      // Avval visible qilib, keyin pozitsiya hisoblaymiz
      dropdown.classList.add('open');
      trigger.classList.add('open');
      positionLocDropdown(trigger, dropdown);
      const si = dropdown.querySelector('.loc-search-input');
      if (si) { si.value = ''; filterLocOptions(si); si.focus(); }
    } else {
      dropdown.classList.remove('open');
      trigger.classList.remove('open');
    }
  }

  // Option qidirish
  function filterLocOptions(input) {
    const q = input.value.toLowerCase().trim();
    const container = input.closest('.loc-dropdown').querySelector('.loc-options');
    let found = 0;
    container.querySelectorAll('.loc-option').forEach(opt => {
      const match = opt.textContent.toLowerCase().includes(q);
      opt.style.display = match ? '' : 'none';
      if (match) found++;
    });
    let empty = container.querySelector('.loc-options-empty');
    if (!found) {
      if (!empty) { empty = document.createElement('div'); empty.className = 'loc-options-empty'; empty.textContent = tr('no_one_found'); container.appendChild(empty); }
      empty.style.display = '';
    } else if (empty) {
      empty.style.display = 'none';
    }
  }

  // Custom dropdown yaratish (trigger + dropdown HTML)
  function buildLocDropdown(wrapId, config) {
    const wrap = document.getElementById(wrapId + '-wrap');
    if (!wrap) return;
    // Agar allaqachon qurilgan bo'lsa, faqat options ni yangilaymiz
    let dropdown = document.getElementById(wrapId + '-dd');
    let trigger  = document.getElementById(wrapId + '-trigger');

    if (!trigger) {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.id = wrapId + '-trigger';
      trigger.className = 'loc-trigger';
      trigger.dataset.for = wrapId + '-dd';
      trigger.innerHTML = `
        <div class="loc-trigger-icon loc-trigger-icon--${config.type}">${config.emoji}</div>
        <div class="loc-trigger-text">
          <div class="loc-trigger-label">${config.label}</div>
          <div class="loc-trigger-value placeholder" id="${wrapId}-trigger-val">${config.placeholder}</div>
        </div>
        <svg class="loc-trigger-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      `;
      trigger.addEventListener('click', () => toggleLocDropdown(wrapId + '-trigger', wrapId + '-dd'));
      wrap.insertBefore(trigger, wrap.firstChild);
    }

    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = wrapId + '-dd';
      dropdown.className = 'loc-dropdown';
      dropdown.innerHTML = `
        <div class="loc-search">
          <div class="loc-search-wrap">
            <svg class="loc-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input class="loc-search-input" type="text" placeholder="Qidirish..." oninput="filterLocOptions(this)" />
          </div>
        </div>
        <div class="loc-options" id="${wrapId}-opts"></div>
      `;
      // dropdown ni overlay-root ga ko'chirish — backdrop-filter stacking muammosidan xalos
      getOverlayRoot().appendChild(dropdown);
      dropdown.style.pointerEvents = 'auto';
    }

    // Options ni to'ldirish
    const optContainer = document.getElementById(wrapId + '-opts');
    optContainer.innerHTML = '';
    (config.options || []).forEach(item => {
      const div = document.createElement('div');
      div.className = 'loc-option';
      div.dataset.value = item.value;
      div.innerHTML = `
        ${item.flag ? `<span class="loc-option-flag">${item.flag}</span>` : ''}
        <span style="flex:1">${item.label}</span>
        <svg class="loc-option-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      `;
      div.addEventListener('click', () => {
        selectLocOption(wrapId, item.value, item.label, config);
      });
      optContainer.appendChild(div);
    });
  }

  // Option tanlanganda
  function selectLocOption(wrapId, value, label, config) {
    // Native select value ni ham o'zgartirish
    const nativeSel = document.getElementById(wrapId.replace(/-wrap$/, '').replace(wrapId, wrapId.split('-').pop()).replace(/.*/, wrapId.split('-').slice(-1)[0]));
    // Oddiyroq: wrapId dan native select id ni hisoblash
    const nativeId = wrapId; // wrapId = inp-country | inp-region | inp-district | sf-country...
    const native = document.getElementById(nativeId);
    if (native) native.value = value;

    // Trigger matnini yangilash
    const valEl = document.getElementById(wrapId + '-trigger-val');
    if (valEl) {
      valEl.textContent = label || value;
      valEl.classList.toggle('placeholder', !value);
    }
    const trigger = document.getElementById(wrapId + '-trigger');
    if (trigger) trigger.classList.toggle('filled', !!value);

    // Option lardan selected klassini belgilash
    document.querySelectorAll(`#${wrapId}-opts .loc-option`).forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.value === value);
    });

    // Dropdown yopish
    const dd = document.getElementById(wrapId + '-dd');
    if (dd) dd.classList.remove('open');
    if (trigger) trigger.classList.remove('open');

    // Callback chaqirish
    if (config.onChange) config.onChange(value);
  }

  // Step dots yangilash
  function updateLocationSteps(prefix, step) {
    for (let i = 1; i <= 3; i++) {
      const dot = document.getElementById(prefix + '-step-' + i);
      if (!dot) continue;
      dot.classList.remove('active', 'done');
      if (i < step) dot.classList.add('done');
      else if (i === step) dot.classList.add('active');
    }
  }

  // Wrapper ko'rsatish/yashirish
  function showLocationWrap(id) {
    const wrap = document.getElementById(id + '-wrap');
    if (wrap) wrap.style.display = 'block';
  }
  function hideLocationWrap(id) {
    const wrap = document.getElementById(id + '-wrap');
    if (wrap) wrap.style.display = 'none';
    // trigger ni tozalash
    const valEl = document.getElementById(id + '-trigger-val');
    if (valEl) { valEl.textContent = valEl.closest('.loc-trigger')?.dataset?.placeholder || ''; valEl.classList.add('placeholder'); }
    const trigger = document.getElementById(id + '-trigger');
    if (trigger) trigger.classList.remove('filled', 'open');
    const dd = document.getElementById(id + '-dd');
    if (dd) dd.classList.remove('open');
    const native = document.getElementById(id);
    if (native) native.value = '';
  }
  function markLocationFilled(id, filled) {} // legacy compat — unused

  // Davlatlar ro'yxati — tarjima orqali
  function getCountriesList(includeAll = false) {
    const list = [
      { value: "Oʻzbekiston", key: 'country_uz', flag: "🇺🇿" },
      { value: "Rossiya",      key: 'country_ru', flag: "🇷🇺" },
      { value: "Qozogʻiston", key: 'country_kz', flag: "🇰🇿" },
      { value: "Qirgʻiziston",key: 'country_kg', flag: "🇰🇬" },
      { value: "Tojikiston",   key: 'country_tj', flag: "🇹🇯" },
      { value: "Turkmaniston", key: 'country_tm', flag: "🇹🇲" },
      { value: "Ozarbayjon",   key: 'country_az', flag: "🇦🇿" },
      { value: "Armaniston",   key: 'country_am', flag: "🇦🇲" },
      { value: "Gruziya",      key: 'country_ge', flag: "🇬🇪" },
      { value: "Ukraina",      key: 'country_ua', flag: "🇺🇦" },
      { value: "Belarus",      key: 'country_by', flag: "🇧🇾" },
      { value: "Moldova",      key: 'country_md', flag: "🇲🇩" },
      { value: "Boshqa",       key: 'country_other', flag: "🌍" },
    ].map(c => ({ value: c.value, label: tr(c.key) || c.value, flag: c.flag }));
    if (includeAll) {
      return [{ value: '', label: tr('all_countries') || '— Barcha davlatlar —', flag: '🌐' }, ...list];
    }
    return list;
  }

  const COUNTRIES = [
    { value: "Oʻzbekiston", label: "O'zbekiston", flag: "🇺🇿" },
    { value: "Rossiya",      label: "Rossiya",      flag: "🇷🇺" },
    { value: "Qozogʻiston", label: "Qozog'iston",  flag: "🇰🇿" },
    { value: "Qirgʻiziston",label: "Qirg'iziston", flag: "🇰🇬" },
    { value: "Tojikiston",   label: "Tojikiston",   flag: "🇹🇯" },
    { value: "Turkmaniston", label: "Turkmaniston", flag: "🇹🇲" },
    { value: "Ozarbayjon",   label: "Ozarbayjon",   flag: "🇦🇿" },
    { value: "Armaniston",   label: "Armaniston",   flag: "🇦🇲" },
    { value: "Gruziya",      label: "Gruziya",      flag: "🇬🇪" },
    { value: "Ukraina",      label: "Ukraina",      flag: "🇺🇦" },
    { value: "Belarus",      label: "Belarus",      flag: "🇧🇾" },
    { value: "Moldova",      label: "Moldova",      flag: "🇲🇩" },
    { value: "Boshqa",       label: "Boshqa",       flag: "🌍" },
  ];

  // Barcha custom dropdownlarni ishga tushirish
  function initLocationDropdowns() {
    // ── Anketa sahifasi ──────────────────────────────
    buildLocDropdown('inp-country', {
      type: 'country', emoji: '🌍', label: tr('country_label') || 'Davlat', placeholder: tr('loc_select_country') || '— Tanlang —',
      options: getCountriesList(false),
      onChange: (val) => { document.getElementById('inp-country').value = val; onCountryChange(); }
    });
    buildLocDropdown('inp-region', {
      type: 'region', emoji: '🗺️', label: tr('region_label') || 'Viloyat', placeholder: tr('loc_select_region') || '— Viloyatni tanlang —',
      options: [],
      onChange: (val) => { document.getElementById('inp-region').value = val; onRegionChange(); }
    });
    buildLocDropdown('inp-district', {
      type: 'district', emoji: '📍', label: tr('district_label') || 'Tuman / Shahar', placeholder: tr('loc_select_district') || '— Tumanni tanlang —',
      options: [],
      onChange: (val) => { document.getElementById('inp-district').value = val; onDistrictChange(); }
    });

    // ── Qidiruv sahifasi ─────────────────────────────
    buildLocDropdown('sf-country', {
      type: 'country', emoji: '🌍', label: tr('country_label') || 'Davlat', placeholder: tr('loc_all_countries') || '— Barcha davlatlar —',
      options: getCountriesList(true),
      onChange: (val) => { document.getElementById('sf-country').value = val; onSearchCountryChange(); }
    });
    buildLocDropdown('sf-region', {
      type: 'region', emoji: '🗺️', label: tr('region_label') || 'Viloyat', placeholder: tr('loc_all_regions') || '— Barcha viloyatlar —',
      options: [],
      onChange: (val) => { document.getElementById('sf-region').value = val; onSearchRegionChange(); }
    });
    buildLocDropdown('sf-district', {
      type: 'district', emoji: '📍', label: tr('district_label') || 'Tuman / Shahar', placeholder: tr('loc_all_districts') || '— Barcha tumanlar —',
      options: [],
      onChange: (val) => { document.getElementById('sf-district').value = val; }
    });

    // Tashqarida bosish — yopish
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.location-select-wrap') && !e.target.closest('.loc-dropdown')) closeAllLocDropdowns(null);
      // Zodiac panellarni tashqariga bosilganda yopish
      const zodiacMenus = ['zodiac-options', 'sf-zodiac-options'];
      zodiacMenus.forEach(id => {
        const menu = document.getElementById(id);
        const trigger = document.getElementById(
          id === 'zodiac-options' ? 'zodiac-picker-toggle' : 'sf-zodiac-toggle'
        );
        if (menu && menu.style.display !== 'none' && menu.style.display !== '') {
          if (!e.target.closest('#' + id) && e.target !== trigger && !trigger?.contains(e.target)) {
            menu.style.display = 'none';
          }
        }
      });
    });

    // Scroll yoki resize bo'lganda ochiq dropdownlarni qayta pozitsiyalash
    const _reposLocDropdown = () => {
      document.querySelectorAll('.loc-dropdown.open').forEach(dd => {
        const wrapId = dd.id.replace('-dd', '');
        const trigger = document.getElementById(wrapId + '-trigger');
        if (trigger) positionLocDropdown(trigger, dd);
      });
      // Zodiac panellarni ham qayta pozitsiyalash
      [['zodiac-options','zodiac-picker-toggle'],['sf-zodiac-options','sf-zodiac-toggle']].forEach(([mid, tid]) => {
        const menu = document.getElementById(mid);
        const trigger = document.getElementById(tid);
        if (menu && menu.style.display !== 'none' && menu.style.display !== '') {
          positionPanel(menu, trigger);
        }
      });
    };
    window.addEventListener('scroll', _reposLocDropdown, true);
    window.addEventListener('resize', _reposLocDropdown);
  }

  // populateRegions/populateDistricts — ham native SELECT ham custom dropdown ni to'ldiradi
  function rebuildLocOptions(wrapId, optionsList, isRegion) {
    const optContainer = document.getElementById(wrapId + '-opts');
    if (!optContainer) return;
    optContainer.innerHTML = '';
    if (isRegion) {
      // "Barcha" option
    }
    optionsList.forEach(item => {
      const div = document.createElement('div');
      div.className = 'loc-option';
      div.dataset.value = typeof item === 'string' ? item : item.value;
      const label = typeof item === 'string' ? item : item.label;
      const flag  = typeof item === 'string' ? '' : (item.flag || '');
      div.innerHTML = `
        ${flag ? `<span class="loc-option-flag">${flag}</span>` : ''}
        <span style="flex:1">${label}</span>
        <svg class="loc-option-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      `;
      const cfgId = wrapId;
      div.addEventListener('click', () => {
        const native = document.getElementById(cfgId);
        if (native) native.value = div.dataset.value;
        const valEl = document.getElementById(cfgId + '-trigger-val');
        if (valEl) { valEl.textContent = label || div.dataset.value; valEl.classList.toggle('placeholder', !div.dataset.value); }
        const trigger = document.getElementById(cfgId + '-trigger');
        if (trigger) trigger.classList.toggle('filled', !!div.dataset.value);
        document.querySelectorAll(`#${cfgId}-opts .loc-option`).forEach(o => o.classList.toggle('selected', o === div));
        const dd = document.getElementById(cfgId + '-dd');
        if (dd) dd.classList.remove('open');
        if (trigger) trigger.classList.remove('open');
        // trigger onChange
        if (cfgId === 'inp-country')  { onCountryChange(); }
        if (cfgId === 'sf-country')   { onSearchCountryChange(); }
        if (cfgId === 'inp-region')   { onRegionChange(); }
        if (cfgId === 'inp-district') { onDistrictChange(); }
        if (cfgId === 'sf-region')    { onSearchRegionChange(); }
        if (cfgId === 'sf-district')  { /* no extra action */ }
      });
      optContainer.appendChild(div);
    });
  }

  // ────────────────────────────────────────────────────────────────────

  // Davlat → regions.json dataset mapping
  // regions.json da viloyat/tumani bor davlatlar
  const COUNTRY_DATASET_MAP = {
    "Oʻzbekiston":  () => uzbekCitiesML,
    "O'zbekiston":  () => uzbekCitiesML,
    "Rossiya":       () => russiaCitiesML,
    "Qozogʻiston":  () => kazakhstanCitiesML,
    "Qozog'iston":  () => kazakhstanCitiesML,
    "Qirgʻiziston": () => kyrgyzstanCitiesML,
    "Qirg'iziston": () => kyrgyzstanCitiesML,
    "Tojikiston":   () => tajikistanCitiesML,
    "Hindiston":    () => hindistonCitiesML,
  };

  // Davlat uchun regions dataseti mavjudmi?
  function getCountryDataset(country) {
    const fn = COUNTRY_DATASET_MAP[country] || COUNTRY_DATASET_MAP[country?.trim()];
    if (!fn) return null;
    const ds = fn();
    if (!ds) return null;
    const lang = currentLang || 'uz';
    return ds[lang] || ds['uz'] || null;
  }

  function onCountryChange() {
    const country = document.getElementById('inp-country')?.value || '';

    loadRegionsData().then(() => {
      const regions = getCountryDataset(country);
      if (regions && Object.keys(regions).length > 0) {
        // Viloyatlari bor davlat
        const opts = Object.keys(regions);
        rebuildLocOptions('inp-region', opts, true);
        showLocationWrap('inp-region');
        hideLocationWrap('inp-district');
        updateLocationSteps('inp', 2);
      } else {
        // Viloyat/tumani yo'q davlat — faqat davlat tanlanadi
        hideLocationWrap('inp-region');
        hideLocationWrap('inp-district');
        updateLocationSteps('inp', country ? 2 : 1);
      }
      updateHiddenCityField('inp-city', country, '', '');
    });
  }

  // Anketa: Viloyat o'zgartirilganda
  function onRegionChange() {
    const country = document.getElementById('inp-country')?.value || '';
    const region  = document.getElementById('inp-region')?.value  || '';

    if (region) {
      const regions = getCountryDataset(country) || {};
      let districts = regions[region] || [];

      // Agar joriy tilda topilmasa, uz tilida qidir
      if (!districts.length) {
        const fn = COUNTRY_DATASET_MAP[country];
        if (fn) {
          const uzRegions = fn()?.['uz'] || {};
          const uzKeys = Object.keys(uzRegions);
          const langKeys = Object.keys(regions);
          const langIdx = langKeys.indexOf(region);
          if (langIdx !== -1 && uzKeys[langIdx]) {
            districts = uzRegions[uzKeys[langIdx]] || [];
          }
        }
      }

      if (districts.length > 0) {
        rebuildLocOptions('inp-district', districts, false);
        showLocationWrap('inp-district');
        updateLocationSteps('inp', 3);
      } else {
        // Tuman yo'q viloyat — tuman selectni yashir
        hideLocationWrap('inp-district');
        updateLocationSteps('inp', 2);
      }
    } else {
      hideLocationWrap('inp-district');
      updateLocationSteps('inp', 2);
    }
    updateHiddenCityField('inp-city', country, region, '');
  }

  // Anketa: Tuman o'zgartirilganda
  function onDistrictChange() {
    const country  = document.getElementById('inp-country')?.value  || '';
    const region   = document.getElementById('inp-region')?.value   || '';
    const district = document.getElementById('inp-district')?.value || '';
    updateHiddenCityField('inp-city', country, region, district);
  }

  // Qidiruv: Davlat o'zgartirilganda
  function onSearchCountryChange() {
    const country = document.getElementById('sf-country')?.value || '';

    loadRegionsData().then(() => {
      const regions = getCountryDataset(country);
      if (regions && Object.keys(regions).length > 0) {
        // Viloyatlari bor davlat
        const opts = Object.keys(regions);
        rebuildLocOptions('sf-region', opts, true);
        showLocationWrap('sf-region');
        hideLocationWrap('sf-district');
        updateLocationSteps('sf', 2);
      } else {
        // Viloyat/tumani yo'q davlat
        hideLocationWrap('sf-region');
        hideLocationWrap('sf-district');
        updateLocationSteps('sf', country ? 2 : 1);
      }
      updateHiddenCityField('sf-city', country, '', '');
    });
  }

  // Qidiruv: Viloyat o'zgartirilganda
  function onSearchRegionChange() {
    const country = document.getElementById('sf-country')?.value || '';
    const region  = document.getElementById('sf-region')?.value  || '';

    if (region) {
      const regions = getCountryDataset(country) || {};
      let districts = regions[region] || [];

      // Agar joriy tilda topilmasa, uz tilida qidir
      if (!districts.length) {
        const fn = COUNTRY_DATASET_MAP[country];
        if (fn) {
          const uzRegions = fn()?.['uz'] || {};
          const uzKeys = Object.keys(uzRegions);
          const langKeys = Object.keys(regions);
          const langIdx = langKeys.indexOf(region);
          if (langIdx !== -1 && uzKeys[langIdx]) {
            districts = uzRegions[uzKeys[langIdx]] || [];
          }
        }
      }

      if (districts.length > 0) {
        rebuildLocOptions('sf-district', districts, false);
        showLocationWrap('sf-district');
        updateLocationSteps('sf', 3);
      } else {
        hideLocationWrap('sf-district');
        updateLocationSteps('sf', 2);
      }
    } else {
      hideLocationWrap('sf-district');
      updateLocationSteps('sf', 2);
    }
    updateHiddenCityField('sf-city', country, region, '');
  }

  // Anketa formini regionlardan to'ldirish (mavjud profil uchun)
  function populateRegionFromCityString(cityStr) {
    if (!cityStr) return;
    loadRegionsData().then(() => {
      let country = '', region = '', district = '';

      // Yangi format: "district||region||country"
      if (cityStr.includes('||')) {
        const parts = cityStr.split('||').map(s => s.trim());
        district = parts[0] || '';
        region   = parts[1] || '';
        country  = parts[2] || '';
      } else {
        // Eski format: "Tuman, Viloyat" yoki "Viloyat" yoki "Davlat"
        const commaSplit = cityStr.split(',').map(s => s.trim());
        if (commaSplit.length >= 2) {
          district = commaSplit[0];
          region   = commaSplit[1];
          country  = "O\u02bbzbekiston";
        } else {
          // Davlat yoki viloyat
          const COUNTRIES_LIST = ["O\u02bbzbekiston","Rossiya","Qozog\u02bbiston","Qirg\u02bbiziston","Tojikiston","Turkmaniston","Ozarbayjon","Armaniston","Gruziya","Ukraina","Belarus","Moldova","Boshqa"];
          if (COUNTRIES_LIST.includes(cityStr.trim())) {
            country = cityStr.trim();
          } else {
            // Viloyat bo'lishi mumkin
            const uzRegions = getUzbekRegions();
            if (Object.keys(uzRegions).includes(cityStr.trim())) {
              region  = cityStr.trim();
              country = "O\u02bbzbekiston";
            } else {
              country = cityStr.trim();
            }
          }
        }
      }

      // Davlatni o'rnating
      if (country) {
        const cSel = document.getElementById('inp-country');
        if (cSel) cSel.value = country;
        const cValEl = document.getElementById('inp-country-trigger-val');
        if (cValEl) {
          cValEl.textContent = _translateCountryValue(country, currentLang || 'uz');
          cValEl.classList.remove('placeholder');
        }
        const cTrigger = document.getElementById('inp-country-trigger');
        if (cTrigger) cTrigger.classList.add('filled');
      }

      // Viloyat uchun options ni quramiz
      if (region) {
        const ds = _getDatasetForCountry(country);
        if (ds) {
          const opts = Object.keys(ds);
          rebuildLocOptions('inp-region', opts, true);
          showLocationWrap('inp-region');
          const rSel = document.getElementById('inp-region');
          if (rSel) rSel.value = region;
          const rValEl = document.getElementById('inp-region-trigger-val');
          if (rValEl) {
            rValEl.textContent = _translateGenericRegion(region, currentLang || 'uz') || region;
            rValEl.classList.remove('placeholder');
          }
          const rTrigger = document.getElementById('inp-region-trigger');
          if (rTrigger) rTrigger.classList.add('filled');
          document.querySelectorAll('#inp-region-opts .loc-option').forEach(o => o.classList.toggle('selected', o.dataset.value === region));
        }
      }

      // Tuman uchun options ni quramiz
      if (district && region) {
        const ds = _getDatasetForCountry(country);
        const districts = ds ? (ds[region] || []) : [];
        if (districts.length) {
          rebuildLocOptions('inp-district', districts, false);
          showLocationWrap('inp-district');
          const dSel = document.getElementById('inp-district');
          if (dSel) dSel.value = district;
          const dValEl = document.getElementById('inp-district-trigger-val');
          if (dValEl) {
            dValEl.textContent = _translateGenericDistrict(district, currentLang || 'uz') || district;
            dValEl.classList.remove('placeholder');
          }
          const dTrigger = document.getElementById('inp-district-trigger');
          if (dTrigger) dTrigger.classList.add('filled');
          document.querySelectorAll('#inp-district-opts .loc-option').forEach(o => o.classList.toggle('selected', o.dataset.value === district));
          updateLocationSteps('inp', 4);
        } else {
          hideLocationWrap('inp-district');
          updateLocationSteps('inp', 3);
        }
      } else if (region) {
        hideLocationWrap('inp-district');
        updateLocationSteps('inp', 3);
      } else {
        updateLocationSteps('inp', country ? 2 : 1);
      }

      // city hidden inputni yangi formatda yangilash
      updateHiddenCityField('inp-city', country, region, district);
    });
  }

  // Davlat uchun joriy tildagi datastet
  function _getDatasetForCountry(country) {
    const lang = currentLang || 'uz';
    const MAP = {
      "O\u02bbzbekiston": uzbekCitiesML, "O'zbekiston": uzbekCitiesML,
      "Rossiya": russiaCitiesML,
      "Qozog\u02bbiston": kazakhstanCitiesML, "Qozog'iston": kazakhstanCitiesML,
      "Qirg\u02bbiziston": kyrgyzstanCitiesML, "Qirg'iziston": kyrgyzstanCitiesML,
      "Tojikiston": tajikistanCitiesML, "Hindiston": hindistonCitiesML,
    };
    const ds = MAP[country];
    if (!ds) return null;
    return ds[lang] || ds['uz'] || null;
  }


  // === SAVE PROFILE ===
  async function saveProfile() {
    if (!photoReady || !photoBase64) {
      showToast(tr('upload_valid_photo'));
      return;
    }

    const name = document.getElementById('inp-name').value.trim();
    const age = parseInt(document.getElementById('inp-age').value);
    const city = document.getElementById('inp-city').value.trim();
    const about = document.getElementById('inp-about')?.value?.trim() || '';
    const zodiac = document.getElementById('sel-zodiac').value;

    if (!selectedGender) { showToast(tr('select_gender_prompt')); return; }
    if (!name) { showToast(tr('enter_name_prompt')); return; }
    if (!age || age < 16 || age > 80) { showToast(tr('enter_age_prompt')); return; }
    if (!city) { showToast(tr('enter_city_prompt')); return; }
    if (selectedGoals.length === 0) { showToast(tr('select_goal_prompt')); return; }

    const trimmedInterests = Array.from(new Set((selectedInterests || []).filter(Boolean))).slice(0, MAX_INTERESTS_ALLOWED);
    if ((selectedInterests || []).length > MAX_INTERESTS_ALLOWED) {
      showToast(tr('max_interests_hint'));
    }

    // Backendga key sifatida saqlash (int_kino, goal_dostlik kabi)
    // Ko'rsatishda tr() orqali tarjima qilinadi
    const selectedCountry = document.getElementById('inp-country')?.value?.trim() || '';
    const selectedRegion = document.getElementById('inp-region')?.value?.trim() || '';
    const selectedDistrict = document.getElementById('inp-district')?.value?.trim() || '';

    const profile = {
      gender: selectedGender,
      full_name: name,
      age: age,
      city: city,
      country: selectedCountry || 'Oʻzbekiston',
      region: selectedRegion || null,
      about: about,
      zodiac: zodiac,
      interests: trimmedInterests,
      goals: selectedGoals,
      photo_base64: photoBase64 || null
    };

    setSavedProfile(profile);

    let serverSaved = false;
    if (userId) {
      serverSaved = await saveProfileToServer(profile, userId);
    }

    if (tg) {
      sendWebAppData({ action: 'save_profile', profile });
    }

    setDefaultSearchGender();
    showToast(serverSaved ? tr('profile_saved_success') : tr('profile_saved_local'));

    document.querySelector('.bottom-nav').style.display = 'flex';
    showPage('search');
  }

  function doSearch() {
    tinderUsers = [];
    tinderIndex = 0;
    tinderHistory = [];

    const filters = {};

    // Ism bo'yicha qidirish
    const nameVal = document.getElementById('sf-name')?.value?.trim();
    if (nameVal) filters.name = nameVal;

    // Jins
    if (selectedSearchGender) filters.gender = selectedSearchGender;

    // Kengaytirilgan filtrlar
    const ageFrom = document.getElementById('sf-age-from')?.value?.trim();
    if (ageFrom) filters.age_from = parseInt(ageFrom);
    const ageTo = document.getElementById('sf-age-to')?.value?.trim();
    if (ageTo) filters.age_to = parseInt(ageTo);

    // Region bo'yicha filter (davlat → viloyat → tuman)
    const sfCountry = document.getElementById('sf-country')?.value?.trim();
    const sfRegion = document.getElementById('sf-region')?.value?.trim();
    const sfDistrict = document.getElementById('sf-district')?.value?.trim();
    const sfCityHidden = document.getElementById('sf-city')?.value?.trim();

    if (sfDistrict) {
      // Eng aniq: tuman bo'yicha
      filters.city = sfDistrict;
    } else if (sfRegion) {
      // Viloyat bo'yicha (barcha tumanlar)
      filters.city = sfRegion;
    } else if (sfCountry) {
      // Davlat bo'yicha
      filters.country = sfCountry;
    } else if (sfCityHidden) {
      filters.city = sfCityHidden;
    }

    // Backendga key sifatida yuborish (goal_dostlik, int_kino kabi)
    if (selectedSearchGoals.length > 0) {
      filters.goals = selectedSearchGoals;
    }
    if (selectedSearchInterests.length > 0) {
      filters.interests = selectedSearchInterests;
    }

    // Burj bo'yicha qidirish
    const zodiacFilterEl = document.getElementById('sf-zodiac');
    if (zodiacFilterEl && zodiacFilterEl.value) {
      filters.zodiac = zodiacFilterEl.value;
    }

    // Burjga mos qidirish
    const zodiacCompatEl = document.getElementById('sf-zodiac-compat');
    if (zodiacCompatEl && zodiacCompatEl.checked) {
      const myZodiac = getMyZodiac();
      if (myZodiac && ZODIAC_COMPATIBILITY[myZodiac]) {
        filters.zodiac_compat_list = ZODIAC_COMPATIBILITY[myZodiac].mos;
      } else {
        if (panelBody) {
          panelBody.innerHTML = `<div class="empty-state"><div class="empty-icon">⭐</div><h3>${tr('zodiac_not_set')}</h3><p>${tr('zodiac_not_set_hint')}</p><button class="btn-primary" style="margin-top:16px;padding:12px 24px;border-radius:999rem;" onclick="closeSearchResultsModal();showPage('profile')">${tr('fill_profile')}</button></div>`;
        }
        if (modal) modal.style.display = 'flex';
        return;
      }
    }

    // Open modal immediately with loading
    const modal = document.getElementById('search-results-modal');
    const panelBody = document.getElementById('search-results-panel-body');
    if (panelBody) panelBody.innerHTML = `<div class="loading"><div class="spinner"></div> ${tr('searching')}</div>`;
    if (modal) modal.style.display = 'flex';

    if (!userId) {
      if (panelBody) panelBody.innerHTML = `<div class="empty-state"><div class="empty-icon"></div><h3>${tr('login_via_telegram')}</h3><p>${tr('open_in_telegram')}</p></div>`;
      return;
    }
    fetchSearchResultsModal(userId, filters);
  }

  // === TINDER CARD STATE ===
  let tinderUsers = [];
  let tinderIndex = 0;
  let tinderHistory = [];

  async function fetchSearchResultsModal(telegramId, filters) {
    const panelBody = document.getElementById('search-results-panel-body');

    tinderUsers = [];
    tinderIndex = 0;
    tinderHistory = [];

    try {
      const data = await apiPost('/api/search', { telegram_id: telegramId || 0, filters });

      if (data.success && data.users && data.users.length > 0) {
        tinderUsers = data.users;
        tinderIndex = 0;
        tinderHistory = [];
        // Render tinder cards inside modal panel - FULL WIDTH
        if (panelBody) {
          panelBody.innerHTML = `<div id="swipe-container-modal" class="swipe-container" style="padding:0;width:100%;"></div>`;
          renderTinderCardInModal();
        }
      } else {
        tinderUsers = [];
        tinderIndex = 0;
        tinderHistory = [];
        if (panelBody) {
          panelBody.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.info}</div><h3>${tr('no_one_found')}</h3><p>${tr('no_one_hint')}</p></div>`;
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      if (panelBody) {
        panelBody.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.alert}</div><h3>${tr('server_error')}</h3><p>${tr('check_internet')}</p><button class="btn-primary" style="margin-top:16px;padding:12px 24px;border-radius:999rem;" onclick="closeSearchResultsModal();setTimeout(doSearch,300)">🔄 ${tr('retry_btn')}</button></div>`;
      }
      showToast(tr('server_error'));
    }
  }

  function renderTinderCardInModal(direction) {
    const container = document.getElementById('swipe-container-modal');
    if (!container) { renderTinderCard(direction); return; }

    if (tinderIndex >= tinderUsers.length) {
      container.innerHTML = `
        <div class="no-more-wrap">
          <div class="no-more-emoji">✨</div>
          <div class="no-more-title">${tr('all_viewed')}</div>
          <div class="no-more-sub">${tr('all_viewed_hint')}</div>
          <button class="no-more-btn" onclick="closeSearchResultsModal();doSearch()">🔍 ${tr('search_again')}</button>
        </div>`;
      return;
    }

    const u = tinderUsers[tinderIndex];
    const total = tinderUsers.length;
    const photo = u.photo_base64 || u.photo_file_id;
    const locationLabel = formatLocationLabel(u.city);
    const myZodiac = getMyZodiac();
    const compatStatus = u.zodiac ? getZodiacCompatStatus(myZodiac, u.zodiac) : null;
    const compatBadge = compatStatus === 'mos'
      ? `<span style="background:#27ae60;color:#fff;border-radius:12px;padding:2px 10px;font-size:12px;font-weight:600;margin-left:6px;">💚 ${tr('compat_good')}</span>`
      : compatStatus === 'qiyin'
      ? `<span style="background:#e74c3c;color:#fff;border-radius:12px;padding:2px 10px;font-size:12px;font-weight:600;margin-left:6px;">⚡ ${tr('compat_difficult')}</span>`
      : '';

    const animClass = direction === 'left' ? 'animate-left' : direction === 'right' ? 'animate-right' : direction === 'up' ? 'animate-up' : 'animate-in';

    container.innerHTML = `
      <div class="swipe-counter">
        <div class="swipe-dots">${tinderUsers.map((_,i)=>`<div class="swipe-dot${i===tinderIndex?' active':''}"></div>`).join('')}</div>
        <span>${tinderIndex+1} / ${total}</span>
      </div>
      <div class="tinder-card ${animClass}" id="tinder-card-el" style="height:calc(100vh - 80px);">
        <div class="stamp like">❤️ LIKE</div>
        <div class="stamp nope">✕ NOPE</div>
        <div class="stamp superlike">⭐ SUPER</div>
        <div class="tinder-photo">
          ${photo ? `<img src="${photo}" alt="${u.full_name}" onclick="openPhotoViewer('${escapeJs(photo)}','${escapeJs(u.full_name)}')" />` : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:100px;">${u.gender==='erkak'?'👨':'👩'}</div>`}
          <div class="tinder-photo-gradient"></div>
          <div class="tinder-photo-info">
            <div class="tinder-photo-name">${u.full_name}, ${u.age}</div>
            <div class="tinder-photo-meta">📍 ${locationLabel}${u.zodiac ? ' • ' + getZodiacDisplay(u.zodiac) : ''}${compatBadge}</div>
            ${u.about ? `<div class="tinder-photo-about">${escapeHtml(u.about)}</div>` : ''}
          </div>
        </div>
        <div class="tinder-actions">
          <button class="tinder-btn tinder-btn-back" onclick="tinderBackModal()" title="${tr('btn_back')}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 12l6-6M3 12l6 6"/></svg>
          </button>
          <button class="tinder-btn tinder-btn-nope" onclick="tinderSwipeModal('left')" title="O'tkazib yuborish">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button class="tinder-btn tinder-btn-superlike" onclick="tinderSuperLikeModal()" title="${tr('super_like')}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
          <button class="tinder-btn tinder-btn-like" onclick="tinderSwipeModal('right')" title="${tr('like')}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button class="tinder-btn tinder-btn-msg" onclick="openMessageModalFromTinder(${u.telegram_id},'${escapeJs(u.full_name)}')" title="Xabar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>`;

    const tinderCardEl = document.getElementById('tinder-card-el');
    setupTinderDragOnModal(tinderCardEl);
    if (tinderCardEl) {
      tinderCardEl.addEventListener('click', function(e) {
        if (e.target.closest('.tinder-actions')) return;
        showProfileDetail(u);
      });
    }
  }

  function tinderSwipeModal(direction) {
    const card = document.getElementById('tinder-card-el');
    const u = tinderUsers[tinderIndex];
    if (direction === 'right') sendLike(u.telegram_id);
    // Ko'rilgan barcha anketalarni saqlash
    try { addToAllViewed(u); } catch(e) {}
    tinderHistory.push(tinderIndex);
    tinderIndex++;
    if (card) {
      card.classList.add(direction === 'right' ? 'animate-right' : 'animate-left');
      setTimeout(() => renderTinderCardInModal(), 380);
    } else {
      renderTinderCardInModal();
    }
  }

  function tinderSuperLikeModal() {
    const u = tinderUsers[tinderIndex];
    const btn = document.querySelector('.tinder-btn-superlike');
    if (btn) { btn.classList.add('flash'); setTimeout(()=>btn.classList.remove('flash'),600); }
    openStickerModal(u.telegram_id);
  }

  function tinderBackModal() {
    if (tinderHistory.length === 0) { showToast(tr('cannot_go_back')); return; }
    tinderIndex = tinderHistory.pop();
    renderTinderCardInModal();
  }

  function openMessageModalFromTinder(targetId, name) {
    openMessageModal(targetId, name, '', true);
  }

  function setupTinderDragOnModal(card) {
    if (!card) return;
    let startX = 0, startY = 0, dx = 0;
    const onStart = (e) => {
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      startY = (e.touches ? e.touches[0].clientY : e.clientY);
      card.style.transition = 'none';
    };
    const onMove = (e) => {
      dx = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
      const dy = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
      const rotate = dx * 0.05;
      card.style.transform = `translateX(${dx}px) translateY(${dy*0.3}px) rotate(${rotate}deg)`;
      const likeStamp = card.querySelector('.stamp.like');
      const nopeStamp = card.querySelector('.stamp.nope');
      if (likeStamp) likeStamp.style.opacity = dx > 30 ? Math.min((dx-30)/60,1) : '0';
      if (nopeStamp) nopeStamp.style.opacity = dx < -30 ? Math.min((-dx-30)/60,1) : '0';
    };
    const onEnd = () => {
      card.style.transition = '';
      card.style.transform = '';
      const likeStamp = card.querySelector('.stamp.like');
      const nopeStamp = card.querySelector('.stamp.nope');
      if (likeStamp) likeStamp.style.opacity = '0';
      if (nopeStamp) nopeStamp.style.opacity = '0';
      if (dx > 80) tinderSwipeModal('right');
      else if (dx < -80) tinderSwipeModal('left');
      dx = 0;
    };
    card.addEventListener('touchstart', onStart, {passive:true});
    card.addEventListener('touchmove', onMove, {passive:true});
    card.addEventListener('touchend', onEnd);
    card.addEventListener('mousedown', onStart);
    card.addEventListener('mousemove', (e) => { if (e.buttons) onMove(e); });
    card.addEventListener('mouseup', onEnd);
  }

  async function fetchSearchResults(telegramId, filters) {
    const swipeContainer = document.getElementById('swipe-container');
    const resultsEl = document.getElementById('search-results');

    tinderUsers = [];
    tinderIndex = 0;
    tinderHistory = [];

    if (swipeContainer) {
      swipeContainer.innerHTML = `<div class="loading"><div class="spinner"></div> ${tr('searching')}</div>`;
    }

    try {
      const data = await apiPost('/api/search', { telegram_id: telegramId || 0, filters });

      if (data.success && data.users && data.users.length > 0) {
        tinderUsers = data.users;
        tinderIndex = 0;
        tinderHistory = [];
        if (resultsEl) resultsEl.style.display = 'block';
        renderTinderCard();
      } else {
        tinderUsers = [];
        tinderIndex = 0;
        tinderHistory = [];
        if (swipeContainer) {
          swipeContainer.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.info}</div><h3>${tr('no_one_found')}</h3><p>${tr('no_one_hint')}</p></div>`;
        }
        if (resultsEl) resultsEl.style.display = 'block';
      }
    } catch (error) {
      showToast(tr('server_error'));
      if (swipeContainer) {
        swipeContainer.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.alert}</div><h3>${tr('cannot_connect')}</h3><p>${tr('check_internet')}</p></div>`;
      }
      if (resultsEl) resultsEl.style.display = 'block';
    }
  }

  function renderTinderCard(direction) {
    const container = document.getElementById('swipe-container');
    if (!container) return;

    if (tinderIndex >= tinderUsers.length) {
      container.innerHTML = `
        <div class="no-more-wrap">
          <div class="no-more-emoji">✨</div>
          <div class="no-more-title">${tr('all_viewed')}</div>
          <div class="no-more-sub">${tr('all_viewed_hint')}</div>
          <button class="no-more-btn" onclick="doSearch()">🔍 ${tr('search_again')}</button>
        </div>`;
      return;
    }

    const u = tinderUsers[tinderIndex];
    const total = tinderUsers.length;
    const icon = u.gender === 'erkak' ? ICONS.male : ICONS.female;
    const photo = u.photo || u.photo_file_id || u.photo_base64;
    const locationLabel = formatLocationLabel(u.city);

    const photoHtml = photo
      ? `<img src="${photo}" alt="${u.full_name}" loading="lazy" />`
      : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--ios-blue);opacity:0.4;">${icon}</div>`;

    const dots = Array.from({length: Math.min(total, 7)}, (_, i) => {
      const ci = Math.min(tinderIndex, 6);
      return `<div class="swipe-dot ${i === ci ? 'active' : ''}"></div>`;
    }).join('');

    const goals = (u.goals || []).map(g => `<span class="tinder-tag">${g}</span>`).join('');
    const interests = (u.interests || []).map(i => `<span class="tinder-tag tinder-tag-alt">${i}</span>`).join('');

    container.innerHTML = `
      <div class="swipe-counter">
        <div class="swipe-dots">${dots}</div>
        <span style="margin-left:6px;">${tinderIndex+1} / ${total}</span>
      </div>
      <div class="tinder-card animate-in" id="tinder-card" data-user="${escapeHtmlAttr(JSON.stringify(u))}" style="height:calc(100vh - 80px);">
        <span class="stamp like" id="stamp-like">LIKE 💚</span>
        <span class="stamp nope" id="stamp-nope">NOPE ✗</span>
        <span class="stamp superlike" id="stamp-super">SUPER ⭐</span>
        <div class="tinder-photo">
          ${photoHtml}
          <div class="tinder-photo-gradient"></div>
          <div class="tinder-photo-info">
            <div class="tinder-photo-name">${u.full_name}, ${u.age}</div>
            <div class="tinder-photo-meta">📍 ${locationLabel}${u.zodiac ? ' &nbsp;•&nbsp; ' + getZodiacDisplay(u.zodiac) : ''}</div>
          </div>
        </div>
        <div class="tinder-body">
          ${u.about ? `<div class="tinder-about-text">${escapeHtml(u.about)}</div>` : ''}
          <div class="tinder-tags-wrap">${goals}${interests}</div>
        </div>
        <div class="tinder-actions" onclick="event.stopPropagation()">
          <button class="tinder-btn tinder-btn-back" onclick="tinderBack()" title="${tr('btn_back')}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 12l6-6M3 12l6 6"/></svg>
          </button>
          <button class="tinder-btn tinder-btn-nope" onclick="tinderDislike()" title="${tr('btn_dislike')}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button class="tinder-btn tinder-btn-superlike" id="superlike-btn" onclick="openStickerModal(${u.telegram_id})" title="${tr('super_like')}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
          <button class="tinder-btn tinder-btn-like" onclick="tinderLike()" title="${tr('like')}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button class="tinder-btn tinder-btn-msg" onclick="event.stopPropagation(); openMessageModal(${u.telegram_id},'${escapeJs(u.full_name)}','${escapeJs(photo||'')}', ${u.can_write});" title="${tr('send_message_btn')}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>`;

    // Tinder card click - data attribute orqali showProfileDetail
    const tinderCard = document.getElementById('tinder-card');
    if (tinderCard) {
      tinderCard.addEventListener('click', function(e) {
        if (e.target.closest('.tinder-actions')) return;
        try {
          const raw = this.dataset.user
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
          showProfileDetail(JSON.parse(raw));
        } catch(err) {
          showProfileDetail(tinderUsers[tinderIndex]);
        }
      });
    }
  }

  function showStamp(type) {
    const el = document.getElementById('stamp-' + type);
    if (!el) return;
    el.style.opacity = '1';
    setTimeout(() => { if(el) el.style.opacity = '0'; }, 600);
  }

  async function tinderLike() {
    const u = tinderUsers[tinderIndex];
    if (!u) return;

    // Limit tekshirish
    const limitOk = await checkLimit('likes');
    if (!limitOk) {
      showLimitExceeded('likes');
      return;
    }

    showStamp('like');
    const card = document.getElementById('tinder-card');
    if (card) card.classList.add('animate-right');
    sendLike(u.telegram_id);
    tinderHistory.push(tinderIndex);
    setTimeout(() => { tinderIndex++; renderTinderCard('right'); }, 380);
  }

  function tinderDislike() {
    const u = tinderUsers[tinderIndex];
    if (!u) return;
    showStamp('nope');
    const card = document.getElementById('tinder-card');
    if (card) card.classList.add('animate-left');
    tinderHistory.push(tinderIndex);
    setTimeout(() => { tinderIndex++; renderTinderCard('left'); }, 380);
  }

  function tinderBack() {
    if (!tinderHistory.length) { showToast(tr('cannot_go_back')); return; }
    tinderIndex = tinderHistory.pop();
    renderTinderCard();
    showToast(tr('previous_candidate'));
  }

  // === STICKERS ===
  const STICKERS = ['😇','😅','😳','😎','🤔','👋','🥰','❤️','😍','🤫','😜','🫣','👍','👏','😡','🫦','🔥','💔','🌹','😉'];
  let stickerTargetId = null;

  async function openStickerModal(toUserId) {
    if (!userId) {
      showToast(tr('user_id_not_found'));
      return;
    }

    // Super Like limit tekshirish
    const limitOk = await checkLimit('super_likes');
    if (!limitOk) {
      showLimitExceeded('super_likes');
      return;
    }

    stickerTargetId = toUserId;
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = STICKERS.map(s =>
      `<button class="sticker-btn" onclick="sendSticker('${s}')">${s}</button>`
    ).join('');
    document.getElementById('sticker-overlay').style.display = 'flex';
    const btn = document.getElementById('superlike-btn');
    if (btn) { btn.classList.add('flash'); setTimeout(()=>btn.classList.remove('flash'),500); }
  }

  function closeStickerModal(e) {
    if (e && e.target !== document.getElementById('sticker-overlay')) return;
    document.getElementById('sticker-overlay').style.display = 'none';
    stickerTargetId = null;
  }

  async function sendSticker(sticker) {
    document.getElementById('sticker-overlay').style.display = 'none';
    if (!stickerTargetId || !userId) { showToast(tr('generic_error')); return; }

    showStamp('super');
    const card = document.getElementById('tinder-card');
    if (card) card.classList.add('animate-up');

    const likeData = await apiPost('/api/likes/send', {
      from_user: userId,
      to_user: stickerTargetId,
      super_like: true,
      sticker: sticker
    });

    if (likeData.error === 'limit_exceeded') {
      showLimitExceeded('super_likes');
      return;
    }

    if (likeData.match && likeData.match_id) {
      // Mutual match — super like + chat xabar yuboramiz va chatni ochamiz
      await apiPost('/api/chat/send', {
        match_id: likeData.match_id,
        sender_id: userId,
        message: `${sticker} ⭐ Super Like!`
      });
      await loadChats();
      showToast(tr('match_super_like').replace('{sticker}', sticker));
      const matchName = tr('chat_user_default');
      openChatRoom(likeData.match_id, matchName, '');
    } else {
      // Bir tomonlama — faqat toast, chat OCHILMAYDI
      showToast(tr('super_like_sent_hint').replace('{sticker}', sticker));
    }

    const renderNextCard = document.getElementById('swipe-container-modal')
      ? renderTinderCardInModal
      : renderTinderCard;

    tinderHistory.push(tinderIndex);
    setTimeout(() => {
      tinderIndex++;
      renderNextCard();
    }, 380);
    stickerTargetId = null;
  }

  async function loadPendingLikesIndicator() {
    const badge = document.getElementById('search-likes-badge');
    if (!badge || !userId) {
      if (badge) badge.style.display = 'none';
      return;
    }
    const data = await apiPost('/api/likes/received', { telegram_id: userId });
    const count = data.success ? (data.likes || []).length : 0;
    if (count > 0) {
      badge.textContent = count > 9 ? '9+' : count;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }

  async function openIncomingLikesModal() {
    const modal = document.getElementById('likes-modal');
    const body = document.getElementById('likes-modal-body');
    if (!modal || !body) return;
    modal.style.display = 'flex';
    if (!userId) {
      body.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.alert}</div><h3>${tr('user_not_identified')}</h3><p>${tr('telegram_id_not_found')}</p></div>`;
      return;
    }
    body.innerHTML = `<div class="loading"><div class="spinner"></div> ${tr('loading')}</div>`;

    const data = await apiPost('/api/likes/received', { telegram_id: userId });
    if (!data.success) {
      body.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.alert}</div><h3>${tr('error_occurred')}</h3><p>${tr('please_retry')}</p></div>`;
      return;
    }

    const likes = data.likes || [];
    if (!likes.length) {
      body.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.info}</div><h3>${tr('no_likes_yet')}</h3><p>${tr('no_likes_hint')}</p></div>`;
      return;
    }

    body.innerHTML = `
      <div class="section-title" style="margin-top:0;">${tr('people_who_liked_you')}</div>
      <div class="likes-modal-body">
        ${likes.map(u => {
          const photo = u.photo_base64 || u.photo_file_id || '';
          return `
            <div class="like-notification-card" data-user="${escapeHtmlAttr(JSON.stringify(u))}">
              <div class="like-notification-photo">
                ${photo ? `<img src="${photo}" alt="${escapeJs(u.full_name)}" />` : `${u.gender === 'erkak' ? ICONS.male : ICONS.female}`}
              </div>
              <div class="like-notification-info">
                <div>
                  <strong>${u.full_name}</strong>
                  <div class="like-notification-meta">${u.age} ${tr('years_old')}${u.city ? ' • ' + formatLocationLabel(u.city || '') : ''}</div>
                </div>
                <div class="like-notification-actions">
                  <button class="like-btn" onclick="event.stopPropagation(); acceptLike(${u.telegram_id}, '${escapeJs(u.full_name)}', '${escapeJs(photo)}');">${tr('accept')}</button>
                  <button class="reject-btn" onclick="event.stopPropagation(); rejectLike(${u.telegram_id}, '${escapeJs(u.full_name)}');">${tr('reject')}</button>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>`;

    // Like kartochkalariga click event
    body.querySelectorAll('.like-notification-card').forEach(card => {
      card.addEventListener('click', function() {
        try {
          const raw = this.dataset.user
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          showProfileDetail(JSON.parse(raw));
          closeLikesModal();
        } catch(e) {}
      });
    });
  }

  function closeLikesModal(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('likes-modal').style.display = 'none';
  }

  async function rejectLike(fromUserId, name) {
    if (!userId) return;
    const data = await apiPost('/api/likes/reject', { telegram_id: userId, from_user: fromUserId });
    if (data.success) {
      showToast(tr('you_rejected').replace('{name}', name));
      loadPendingLikesIndicator();
      openIncomingLikesModal();
    } else {
      showToast(tr('error_retry'));
    }
  }

  function renderProfileCard(u) {
    const icon = u.gender === 'erkak' ? ICONS.male : ICONS.female;
    const goals = (u.goals || []).map(g => `<span class="tinder-tag">${tr(g) || g}</span>`).join('');
    const interests = (u.interests || []).map(i => `<span class="tinder-tag tinder-tag-alt">${tr(i) || i}</span>`).join('');
    const photo = u.photo || u.photo_file_id || u.photo_base64;
    const photoHtml = photo
      ? `<img src="${photo}" alt="${u.full_name}" loading="lazy" />`
      : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--primary);">${icon}</div>`;
    const locationLabel = formatLocationLabel(u.city || '');

    return `
    <div class="profile-card" data-user="${escapeHtmlAttr(JSON.stringify(u))}">
      <div class="profile-photo">${photoHtml}</div>
      <div class="profile-info">
        <div class="profile-name"><span style="display:inline-flex;vertical-align:middle;margin-right:6px;">${icon}</span> ${u.full_name}</div>
        <div class="profile-age-city">${tr('age')}: ${u.age} &nbsp;•&nbsp; ${locationLabel || tr('no_city')}${u.zodiac ? ' • ' + getZodiacDisplay(u.zodiac) : ''}</div>
        ${u.about ? `<div class="profile-bio" style="margin-top:6px;color:var(--text-secondary);font-size:13px;line-height:1.4;">${escapeHtml(u.about)}</div>` : ''}
        <div class="profile-tags" style="margin-top:8px;">${goals}${interests}</div>
      </div>
      <div class="profile-actions">
        <button class="action-btn btn-like" onclick="event.stopPropagation(); sendLike(${u.telegram_id})">
          <span class="btn-icon">${ICONS.heart}</span> ${tr('like')}
        </button>
        <button class="action-btn btn-write" onclick="event.stopPropagation(); openMessageModal(${u.telegram_id}, '${escapeJs(u.full_name)}', '${escapeJs(photo || '')}')">
          <span class="btn-icon">${ICONS.message}</span> ${tr('message')}
        </button>
        <button class="action-btn btn-block" onclick="event.stopPropagation(); sendBlock(${u.telegram_id})">
          <span class="btn-icon">${ICONS.ban}</span> ${tr('block')}
        </button>
      </div>
    </div>`;
  }

  async function acceptLike(fromUserId, name, photo) {
    if (!userId) return;
    const data = await apiPost('/api/likes/accept', { telegram_id: userId, from_user: fromUserId });
    if (data.success) {
      showToast(tr('match_with').replace('{name}', name));
      loadPendingLikesIndicator();
      await loadChats();

      // Qabul qilingan profil kartochkasini bildirishnomalar ro'yxatidan olib tashlaymiz
      const modal = document.getElementById('likes-modal');
      const body  = document.getElementById('likes-modal-body');
      if (body) {
        // Qabul qilingan foydalanuvchi kartochkasini topib o'chiramiz
        const cards = body.querySelectorAll('.like-notification-card');
        cards.forEach(card => {
          try {
            const raw = card.dataset.user
              .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
              .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            const u = JSON.parse(raw);
            if (Number(u.telegram_id) === Number(fromUserId)) {
              card.remove();
            }
          } catch(e) {}
        });

        // Agar ro'yxat bo'sh qolsa, "hali like yo'q" xabarini ko'rsatamiz
        const remaining = body.querySelectorAll('.like-notification-card');
        if (remaining.length === 0) {
          body.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.info}</div><h3>${tr('no_likes_yet')}</h3><p>${tr('no_likes_hint')}</p></div>`;
        }
      }

      // Match bo'lganda darhol chatni ochamiz
      if (data.match_id) {
        openChatRoom(data.match_id, name, photo);
      }
    } else {
      showToast(tr('error_occurred'));
    }
  }

  async function sendLike(toUserId) {
    const fromUserId = Number(userId);
    const toUser = Number(toUserId);

    if (!Number.isFinite(fromUserId) || fromUserId <= 0) {
      showToast(tr('fill_profile_first'));
      return;
    }
    if (!Number.isFinite(toUser) || toUser <= 0) {
      showToast(tr('error_recipient_not_found'));
      return;
    }

    // Limit tekshirish
    const limitOk = await checkLimit('likes');
    if (!limitOk) {
      showLimitExceeded('likes');
      return;
    }

    const data = await apiPost('/api/likes/send', { from_user: fromUserId, to_user: toUser });

    if (data.error === 'limit_exceeded') {
      showLimitExceeded('likes');
      return;
    }

    if (data.success) {
      await loadLimitStatus();
      // Ko'rilganlarga qo'shish
      try {
        let u = tinderUsers.find(x => Number(x.telegram_id) === toUser);
        if (!u) {
          u = data.to_user_profile || { telegram_id: toUser, id: toUser };
        }
        if (u) addToViewed(u, 'liked');
      } catch(e) {}
      if (data.match && data.match_id) {
        // Mutual match — ikkalasi ham like bosgan, chat ochiladi
        showMatchOverlay();
        await loadChats();
        const matchName = (data.to_user_profile?.full_name) || tr('chat_user_default');
        const matchPhoto = (data.to_user_profile?.photo_base64) || (data.to_user_profile?.photo_file_id) || '';
        openChatRoom(data.match_id, matchName, matchPhoto);
      } else {
        // Bir tomonlama like — qabul qiluvchiga bildirishnoma yuborildi
        showToast(tr('like_sent_with_hint'));
      }
    } else {
      showToast(tr('error_prefix') + (data.error || tr('unknown_error')));
    }
  }

  async function sendBlock(blockedId) {
    if (!userId) return;
    await apiPost('/api/block', { blocker: userId, blocked: blockedId });
    showToast(tr('blocked'));
  }

  function showMatchOverlay() {
    document.getElementById('match-overlay').style.display = 'flex';
  }
  function closeMatchOverlay() {
    document.getElementById('match-overlay').style.display = 'none';
  }

  function showProfileDetail(u, showTags = true) {
    const modal = document.getElementById('profile-modal');
    const body = document.getElementById('profile-modal-body');
    if (!modal || !body) return;

    // Chat suhbatdoshi uchun minimal toza dizayn
    if (!showTags) {
      const photo = u.photo || u.photo_file_id || u.photo_base64;
      const locationLabel = u.city ? formatLocationLabel(u.city) : '';

      body.innerHTML = `
        <article class="profile-detail-minimal">
          ${photo ? `<div class="minimal-photo-wrap"><img src="${photo}" alt="${u.full_name}" onclick="openPhotoViewer('${escapeJs(photo)}', '${escapeJs(u.full_name)}')" /></div>` : ''}
          <div class="minimal-info">
            <h2 class="minimal-name">${u.full_name}</h2>
            <div class="minimal-badge">${u.age} ${tr('years_old')} • ${u.gender === 'erkak' ? tr('male') : tr('female')}</div>
            ${locationLabel ? `
            <div class="minimal-location">
              <div class="minimal-loc-card">
                <div class="minimal-loc-icon">📍</div>
                <div class="minimal-loc-text">
                  <div class="minimal-loc-city">${locationLabel}</div>
                </div>
              </div>
            </div>` : ''}
          </div>
        </article>
      `;
      modal.style.display = 'flex';
      return;
    }

    // Asosiy profil ko'rinishi (qidiruv natijalaridan ochilganda)
    const icon = u.gender === 'erkak' ? ICONS.male : ICONS.female;
    const photo = u.photo || u.photo_file_id || u.photo_base64;
    const locationLabel = formatLocationLabel(u.city || '');
    const profileLocation = locationLabel || (u.city ? translateCityLabel(u.city) : tr('no_city'));
    const goals = (u.goals || []).map(g => `<span class="tag">${tr(g) || g}</span>`).join('');
    const visibleInterests = (u.interests || []).slice(0, MAX_INTERESTS_ALLOWED);
    const interests = (u.interests || []).slice(0, MAX_INTERESTS_ALLOWED).map(i => `<span class="tag" style="background:rgba(0,122,255,0.10);color:var(--ios-blue);">${tr(i) || i}</span>`).join('');
    const aboutText = (u.about || '').trim();
    const photoHtml = photo
      ? `<div class="profile-detail-photo-wrap"><img src="${photo}" alt="${u.full_name}" onclick="openPhotoViewer('${escapeJs(photo)}','${escapeJs(u.full_name)}')" /></div>`
      : '';

    body.innerHTML = `
      <article class="profile-detail-shell">
        ${photoHtml}
        <section class="profile-detail-card">
          <div class="profile-detail-badge">${u.gender === 'erkak' ? tr('male') : tr('female')} • ${u.age} ${tr('years_old')}</div>
          <div class="profile-detail-title">${icon} ${u.full_name}</div>
          <div class="profile-detail-meta">📍 ${profileLocation}${u.zodiac ? ' • ' + getZodiacDisplay(u.zodiac) : ''}</div>
          ${aboutText ? `<div class="profile-detail-section"><div class="profile-detail-label">${tr('about_me')}</div><p class="profile-detail-summary">${escapeHtml(aboutText)}</p></div>` : ''}
          ${showTags ? `<div class="profile-detail-section"><div class="profile-detail-label">${tr('goals_label')}</div><div class="chip-row">${goals || `<span class="muted-chip">${tr('not_specified')}</span>`}</div></div>` : ''}
          ${showTags ? `<div class="profile-detail-section"><div class="profile-detail-label">${tr('interests_label')}</div><div class="chip-row">${interests || `<span class="muted-chip">${tr('not_specified')}</span>`}</div><div class="muted-chip" style="margin-top:6px;">${tr('max_interests_display')}</div></div>` : ''}
        </section>
        <div class="profile-action-grid">
          <button class="action-btn btn-like" onclick="sendLike(${u.telegram_id}); closeProfileModal();">
            <span class="btn-icon">${ICONS.heart}</span>
            <span>${tr('like')}</span>
          </button>
          <button class="action-btn btn-write" onclick="openMessageModal(${u.telegram_id}, '${escapeJs(u.full_name)}', '${escapeJs(photo || '')}'); closeProfileModal();">
            <span class="btn-icon">${ICONS.message}</span>
            <span>${tr('message')}</span>
          </button>
        </div>
      </article>
    `;
    modal.style.display = 'flex';
  }

  function openPhotoViewer(src, caption = 'Rasm') {
    const modal = document.getElementById('photo-viewer-modal');
    const img = document.getElementById('photo-viewer-img');
    const label = document.getElementById('photo-viewer-caption');
    if (!modal || !img) return;

    img.src = src || '';
    if (label) label.textContent = caption || tr('photo');
    modal.style.display = 'flex';
  }

  function closeProfileModal(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('profile-modal').style.display = 'none';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function escapeHtmlAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeJs(str) {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"');
  }

  function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.animation = 'none';
    toast.offsetHeight;
    toast.style.animation = '';
    setTimeout(() => { toast.style.display = 'none'; }, duration);
  }

  function getCityRegion(city = '') {
    const value = String(city || '').toLowerCase().trim();
    if (value === 'toshkent shahri' || value === 'toshkent city') {
      return '';
    }
    const rules = [
      { region: 'Andijon viloyati', terms: ['andijon', 'xonobod', 'asaka', 'qorasuv', 'baliqchi', 'buloqboshi', 'izboskan', 'jalaquduq', 'marhamat', 'oltinkoʻl', 'paxtaobod', 'shahrixon', 'ulugʻnor', 'xoʻjaobod', 'qoʻrgʻontepa'] },
      { region: 'Buxoro viloyati', terms: ['buxoro', 'kogon', 'olot', 'vobkent', 'gijduvon', 'romitan', 'shofirkon', 'galaosiyo', 'gazli'] },
      { region: 'Fargʻona viloyati', terms: ['fargʻona', 'fargona', 'qoʻqon', 'qoqon', 'margʻilon', 'margilon', 'quvasoy', 'quva', 'rishton', 'yaypan', 'tinchlik', 'oltiariq', 'furqat', 'bogʻdod', 'beshariq', 'dangʻara', 'soʻx', 'toshloq', 'uchkoʻprik'] },
      { region: 'Jizzax viloyati', terms: ['jizzax', 'dashtobod', 'arnasoy', 'baxmal', 'doʻstlik', 'forish', 'gallaorol', 'mirzachoʻl', 'paxtakor', 'yangiobod', 'zomin', 'zafarobod', 'zarbdor'] },
      { region: 'Xorazm viloyati', terms: ['xorazm', 'urganch', 'xiva', 'pitnak', 'gurlan', 'shovot', 'bogʻot', 'yangiariq', 'tuproqqalʼa', 'hazorasp', 'yangibozor', 'xonqa'] },
      { region: 'Namangan viloyati', terms: ['namangan', 'chust', 'chartaq', 'kosonsoy', 'uchqoʻrgʻon', 'haqqulobod', 'toʻraqoʻrgʻon', 'pop', 'mingbuloq', 'norin', 'uychi', 'yangiqoʻrgʻon'] },
      { region: 'Navoiy viloyati', terms: ['navoiy', 'zarafshon', 'uchquduq', 'nurota', 'qiziltepa', 'goʻzgon', 'gozgon', 'karmana', 'konimex', 'navbahor', 'tomdi', 'xatirchi'] },
      { region: 'Qashqadaryo viloyati', terms: ['qarshi', 'shahrisabz', 'kitob', 'koson', 'muborak', 'yakkabogʻ', 'gʻuzor', 'guzor', 'kamashi', 'chiroqchi', 'dehqonobod', 'mirishkor', 'kasbi', 'nishon'] },
      { region: 'Samarqand viloyati', terms: ['samarqand', 'kattaqoʻrgʻon', 'kattaqorgon', 'urgut', 'oqtosh', 'bulungʻur', 'jomboy', 'chelak', 'nurobod', 'qoshrabot', 'narpay', 'paxtachi', 'payariq', 'pastdargʻom', 'toyloq'] },
      { region: 'Sirdaryo viloyati', terms: ['guliston', 'shirin', 'yangiyer', 'baxt', 'sirdaryo', 'boyovut', 'hovos', 'mirzaobod', 'oqoltin', 'sardoba', 'sayxunobod'] },
      { region: 'Surxondaryo viloyati', terms: ['termiz', 'denov', 'boysun', 'jarqoʻrgʻon', 'qumqoʻrgʻon', 'shargʻun', 'sherobod', 'shoʻrchi', 'angor', 'muzrabot', 'oltinsoy', 'sariosiyo', 'uzun', 'bandixon'] },
      { region: 'Toshkent viloyati', terms: ['toshkent', 'nurafshon', 'angren', 'olmaliq', 'chirchiq', 'ohangaron', 'bekobod', 'yangiyoʻl', 'gazalkent', 'keles', 'piskent', 'chinoz', 'boka', 'oqqoʻrgʻon', 'parkent', 'quyi chirchiq', 'oʻrta chirchiq', 'yuqori chirchiq', 'zangiota'] },
      { region: 'Qoraqalpogʻiston Respublikasi', terms: ['nukus', 'beruniy', 'boʻston', 'mangʻit', 'moʻynoq', 'taxiatosh', 'toʻrtkoʻl', 'xalqobod', 'chimboy', 'shumanay', 'xoʻjayli', 'qoʻngʻirot', 'amudaryo', 'kegeyli', 'qonlikoʻl', 'qorauzyak', 'taxtakoʻpir', 'boʻzatov'] },
    ];

    for (const item of rules) {
      if (item.terms.some(term => value.includes(term))) return item.region;
    }
    return '';
  }

  function formatLocationLabel(city = '') {
    if (!city) return '';
    // Yangi format: "district||region||country" — to'g'ridan _buildLocationString ga yuboramiz
    if (city.includes('||')) {
      const lang = currentLang || 'uz';
      const [district, region, country] = city.split('||').map(s => s.trim());
      return _buildLocationString(country, region, district, lang);
    }
    // Eski format: translateCityLabel orqali
    const translated = translateCityLabel(city);
    if (translated.includes(',') || translated.includes('||')) return translated;
    // Viloyat qo'shishga urinib ko'rish (faqat O'zbekiston uchun)
    const region = getCityRegion(city);
    const translatedRegion = region ? _translateGenericRegion(region, currentLang || 'uz') : '';
    return translatedRegion ? `${translated}, ${translatedRegion}` : translated;
  }

  // ===== PROFILE HELPERS =====
  function isRegistered() {
    return !!getProfile();
  }

  function getProfile() {
    // ALWAYS read from storage — never use a global cache that could leak between users
    const storageKey = getProfileStorageKey();
    const data = localStorage.getItem(storageKey);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.warn('Profile cache parse failed', e);
      }
    }

    // Legacy fallback for older browsers/devices.
    const legacyData = localStorage.getItem('dating_profile');
    if (legacyData) {
      try {
        const parsed = JSON.parse(legacyData);
        return parsed;
      } catch (e) {
        console.warn('Legacy profile cache parse failed', e);
      }
    }

    return null;
  }

  function setSavedProfile(profile) {
    // REMOVED: savedProfile = profile; — no global cache

    if (profile) {
      const storageKey = getProfileStorageKey(profile.telegram_id || userId);
      localStorage.setItem(storageKey, JSON.stringify(profile));
      removeLegacyProfileStorage();
    } else {
      const storageKey = getProfileStorageKey();
      localStorage.removeItem(storageKey);
      removeLegacyProfileStorage();
    }
  }

  async function apiPost(endpoint, body) {
    // Allow overriding API base via query param `?api_base=` or global `window.__API_BASE_URL`.
    // Fallback to configured API_BASE_URL constant, otherwise same-origin.
    const urlParams = new URLSearchParams(window.location.search);
    const override = (urlParams.get('api_base') || window.__API_BASE_URL || '').trim();
    const baseUrl = override
      ? override.replace(/\/$/, '')
      : (API_BASE_URL ? API_BASE_URL.replace(/\/$/, '') : `${window.location.protocol}//${window.location.host}`);

    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
        mode: 'cors'
      });

      const rawText = await res.text();
      let data = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (e) {
        data = { error: rawText || 'Invalid JSON response from API' };
      }

      if (!res.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${res.status}`,
          status: res.status,
          ...data
        };
      }

      return data;
    } catch (e) {
      // CORS yoki tarmoq xatolarini jimroq ko'rsatish
      if (!(e instanceof TypeError && e.message === 'Failed to fetch')) {
        console.warn('API error:', e);
      }
      return { success: false, error: e.message };
    }
  }

  async function saveProfileToServer(profile, telegramId) {
    const data = await apiPost('/api/save_profile', { telegram_id: telegramId, profile });
    return data.success === true;
  }

  async function fetchUserProfile(telegramId) {
    const data = await apiPost('/api/profile', { telegram_id: telegramId });
    return data.success ? data.user : null;
  }

  // === CITY SUGGEST ===
  function suggestCity(val) {
    showSuggestions('city-suggestions', val, (city) => {
      document.getElementById('inp-city').value = city;
      document.getElementById('city-suggestions').style.display = 'none';
    });
  }

  function suggestCitySearch(val) {
    showSuggestions('sf-city-suggestions', val, (city) => {
      document.getElementById('sf-city').value = city;
      document.getElementById('sf-city-suggestions').style.display = 'none';
    });
  }

  function showSuggestions(containerId, val, onSelect) {
    const box = document.getElementById(containerId);
    if (!val || val.length < 1) { box.style.display = 'none'; return; }
    const activeCities = getUzbekCitiesForLang(currentLang);
    const filtered = activeCities.filter(c => c.toLowerCase().includes(val.toLowerCase())).slice(0, 8);
    if (!filtered.length) { box.style.display = 'none'; return; }

    const fnName = `_sugg_${containerId}`;
    box.innerHTML = filtered.map(c => {
      const region = getCityRegion(c);
      const label = region ? `${c} • ${region}` : c;
      return `<div class="suggestion-item" onclick="window['${fnName}'] && window['${fnName}']('${c}')">${label}</div>`;
    }).join('');
    window[fnName] = (city) => {
      onSelect(city);
      box.style.display = 'none';
    };
    box.style.display = 'block';
  }

  function showFaceDetectionWarning(message, detail) {
    if (detail !== undefined) {
      console.warn('Face detection warning:', detail);
    }
    showToast(message);
  }

  // === CHAT FUNCTIONS ===
  async function loadChats() {
    const chatList = document.getElementById('chat-list');
    const emptyState = document.getElementById('chats-empty');
    if (!chatList) return;

    const telegramId = Number(userId);
    if (!Number.isFinite(telegramId) || telegramId <= 0) {
      chatList.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    chatList.innerHTML = `<div class="loading"><div class="spinner"></div> ${tr('loading')}</div>`;

    const data = await apiPost('/api/matches', { telegram_id: telegramId });
    if (!data.success || !data.matches || data.matches.length === 0) {
      chatList.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Pending xabarlarni tekshirib, match bo'lganlarga avtomatik yuboramiz
    try {
      for (const m of data.matches) {
        const partnerId = m.partner_id || m.telegram_id;
        if (!partnerId) continue;
        const pendingKey = 'pending_msg_' + telegramId + '_' + partnerId;
        const pendingRaw = localStorage.getItem(pendingKey);
        if (!pendingRaw) continue;
        const pending = JSON.parse(pendingRaw);
        if (!pending || !pending.message) continue;
        // Pending xabarni yuboramiz
        const sendResult = await apiPost('/api/chat/send', {
          match_id: m.match_id,
          sender_id: telegramId,
          message: pending.message
        });
        if (sendResult.success) {
          localStorage.removeItem(pendingKey);
          // Ko'rilganlarga messaged sifatida qo'shamiz
          try { addToViewed({ id: partnerId, name: pending.name || m.full_name, photo: pending.photo || m.photo_base64 || m.photo_file_id }, 'messaged'); } catch(e2) {}
          showToast('💬 ' + (pending.name || m.full_name) + ' ga xabringiz yetkazildi!');
        }
      }
    } catch(pendingErr) {}

    chatList.innerHTML = data.matches.map(m => {
      const photo = m.photo_base64 || m.photo_file_id || '';
      const partnerData = escapeHtmlAttr(JSON.stringify(m));
      return `
        <div
          class="chat-item"
          data-match-id="${m.match_id}"
          data-name="${escapeHtmlAttr(m.full_name || '')}"
          data-photo="${escapeHtmlAttr(photo)}"
          data-partner="${partnerData}"
        >
          <div class="chat-item-photo">
            ${photo ? `<img src="${photo}" alt="" />` : (m.gender === 'erkak' ? ICONS.male : ICONS.female)}
          </div>
          <div class="chat-item-info">
            <div class="chat-item-name">${m.full_name}</div>
            <div class="chat-item-preview">${tr('open_chat')}</div>
          </div>
        </div>
      `;
    }).join('');

    chatList.querySelectorAll('.chat-item').forEach(item => {
      item.addEventListener('click', () => {
        openChatRoom(
          Number(item.dataset.matchId || 0),
          String(item.dataset.name || ''),
          String(item.dataset.photo || ''),
          item.dataset.partner || null
        );
      });
    });
  }

  function openChatRoom(matchId, name, photo, partnerData = null) {
    currentChatMatchId = matchId;
    let decodedPartner = null;

    try {
      if (partnerData) {
        const normalized = String(partnerData)
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&');
        decodedPartner = JSON.parse(decodeURIComponent(normalized));
      }
    } catch (e) {
      try {
        decodedPartner = JSON.parse(String(partnerData)
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&'));
      } catch (fallbackError) {
        console.warn('Chat partner data parse failed', fallbackError);
      }
    }
    currentChatPartner = { name, photo, user: decodedPartner };
    // Likes modali ochiq bo'lsa yopamiz
    const likesModal = document.getElementById('likes-modal');
    if (likesModal) likesModal.style.display = 'none';
    document.getElementById('chat-modal').style.display = 'flex';
    document.getElementById('chat-user-name').textContent = name;
    document.getElementById('chat-user-photo').src = photo || '';
    document.getElementById('chat-user-name').style.cursor = 'pointer';
    document.getElementById('chat-user-photo').style.cursor = 'pointer';
    document.getElementById('chat-user-name').onclick = () => openPartnerProfile();
    document.getElementById('chat-user-photo').onclick = () => openPartnerProfile();
    loadChatMessages(matchId);

    if (chatRefreshInterval) clearInterval(chatRefreshInterval);
    chatRefreshInterval = setInterval(() => loadChatMessages(matchId), 3000);
  }

  function openPartnerProfile() {
    if (!currentChatPartner?.user) return;
    showProfileDetail(currentChatPartner.user, false);
  }

  function closeChatRoom() {
    document.getElementById('chat-modal').style.display = 'none';
    if (chatRefreshInterval) clearInterval(chatRefreshInterval);
    chatRefreshInterval = null;
    currentChatMatchId = null;
  }

  async function loadChatMessages(matchId) {
    const data = await apiPost('/api/chat/messages', { match_id: matchId });
    const container = document.getElementById('chat-messages');
    if (!data.success || !container) return;

    container.innerHTML = data.messages.map(m => {
      const isMe = m.sender_id == userId;
      if (typeof m.message === 'string' && m.message.startsWith('[RASM]')) {
        const imageSrc = m.message.replace(/^\[RASM\]\s*/, '').trim();
        const caption = isMe ? tr('your_photo') : tr('partner_photo');
        return `<div class="chat-msg ${isMe ? 'chat-msg-me' : 'chat-msg-them'}"><img src="${escapeHtml(imageSrc)}" alt="${caption}" title="${tr('click_to_view')}" onclick="openPhotoViewer('${escapeJs(imageSrc)}', '${escapeJs(caption)}')" style="max-width:100%;border-radius:16px;display:block;cursor:zoom-in;" /></div>`;
      }
      return `<div class="chat-msg ${isMe ? 'chat-msg-me' : 'chat-msg-them'}">${escapeHtml(m.message)}</div>`;
    }).join('');
    container.scrollTop = container.scrollHeight;
  }

  async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message || !currentChatMatchId) return;

    // Xabar limit tekshirish
    const limitOk = await checkLimit('messages');
    if (!limitOk) {
      showLimitExceeded('messages');
      return;
    }

    const data = await apiPost('/api/chat/send', {
      match_id: currentChatMatchId,
      sender_id: userId,
      message: message
    });

    if (data.error === 'limit_exceeded') {
      showLimitExceeded('messages');
      return;
    }

    if (data.success) {
      input.value = '';
      loadChatMessages(currentChatMatchId);
    }
  }

  function toggleEmojiPanel() {
    const panel = document.getElementById('emoji-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }

  function insertEmoji(emoji) {
    const input = document.getElementById('chat-input');
    input.value += emoji;
    input.focus();
  }

  async function sendImageMessage(input) {
    // Rasm yuborish - base64 orqali
    const file = input.files[0];
    if (!file) return;

    // Xabar limit tekshirish
    const limitOk = await checkLimit('messages');
    if (!limitOk) {
      showLimitExceeded('messages');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      const data = await apiPost('/api/chat/send', {
        match_id: currentChatMatchId,
        sender_id: userId,
        message: `[RASM] ${base64}`
      });

      if (data.error === 'limit_exceeded') {
        showLimitExceeded('messages');
        return;
      }

      if (data.success) {
        loadChatMessages(currentChatMatchId);
      }
    };
    reader.readAsDataURL(file);
  }

  // === MY PROFILE ===
  async function loadMyProfile() {
    const container = document.getElementById('my-profile-content');
    if (!container) return;

    if (!userId) {
      container.innerHTML = `<div class="empty-state"><h3>${tr('profile_not_loaded')}</h3></div>`;
      return;
    }

    const user = await fetchUserProfile(userId);
    if (!user || !isProfileComplete(user)) {
      container.innerHTML = `<div class="empty-state"><h3>${tr('profile_not_found')}</h3><p>${tr('please_fill_profile')}</p><button class="btn-primary" style="margin-top:16px;padding:12px 24px;border-radius:999rem;" onclick="showPage('profile')">${tr('fill_profile')}</button></div>`;
      return;
    }

    const genderIcon = user.gender === 'erkak' ? ICONS.male : ICONS.female;
    const goals = (user.goals || []).map(g => `<span class="chip selected" style="pointer-events:none;">${tr(g) || g}</span>`).join('');
    const interests = (user.interests || []).slice(0, MAX_INTERESTS_ALLOWED).map(i => `<span class="chip selected" style="pointer-events:none;background:rgba(255,45,85,0.10);color:#FF2D55;border-color:rgba(255,45,85,0.25);">${tr(i) || i}</span>`).join('');
    const locationLabel = formatLocationLabel(user.city || '');
    const photo = user.photo_base64 || user.photo_file_id;

    container.innerHTML = `
      <div style="text-align:center; padding:20px;">
        ${photo ? `<img src="${photo}" style="width:120px;height:120px;object-fit:cover;border-radius:50%;margin-bottom:16px;" />` : `<div style="font-size:64px;">${genderIcon}</div>`}
        <h2 style="font-size:22px; font-weight:800;">${user.full_name}, ${user.age}</h2>
        <p style="color:var(--text-secondary);">📍 ${locationLabel || user.city || tr('no_city')}${user.zodiac ? ' • ' + getZodiacDisplay(user.zodiac) : ''}</p>
        ${user.about ? `<p style="color:var(--text-secondary);font-size:14px;line-height:1.4;margin-top:8px;">${escapeHtml(user.about)}</p>` : ''}
      </div>
      <div class="card">
        <div class="section-title">${tr('goal')}</div>
        <div class="chips-wrap">${goals || `<span style="color:var(--text-tertiary);font-size:14px;">${tr('not_specified')}</span>`}</div>
      </div>
      <div class="card">
        <div class="section-title">${tr('interests')}</div>
        <div class="chips-wrap">${interests || `<span style="color:var(--text-tertiary);font-size:14px;">${tr('not_specified')}</span>`}</div>
      </div>
    `;
  }

  // === MODAL HELPERS ===
  function closeSearchResultsModal(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('search-results-modal').style.display = 'none';
  }

  function closePhotoViewer(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('photo-viewer-modal').style.display = 'none';
  }

  // === INIT ===
  document.addEventListener('DOMContentLoaded', async () => {
      removeLegacyProfileStorage();

      // Tilni AVVAL yuklash - sahifa ko'rsatilishidan oldin (await!)
      await initLanguage();

      // Custom location dropdownlarni ishga tushirish
      initLocationDropdowns();

    // CRITICAL: Don't restore photo state until we know who the user is
    // This prevents cross-user photo leakage

    // Check if user has profile
    if (userId) {
      fetchUserProfile(userId).then(user => {
        if (user && isProfileComplete(user)) {
          setSavedProfile(user);
          document.querySelector('.bottom-nav').style.display = 'flex';
          showPage('search');
          loadLimitStatus();
          // Sahifa yuklangandan so'ng tarjimalarni qayta qo'llash
          setTimeout(() => applyTranslations(), 100);
        } else {
          // No profile on server OR profile is incomplete — clear localStorage too (e.g. DB was wiped)
          setSavedProfile(null);
          resetProfileFormState();
          // If server returned incomplete profile data, pre-fill what we have
          if (user) populateProfileForm(user);
          document.querySelector('.bottom-nav').style.display = 'none';
          showPage('profile');
          setTimeout(() => applyTranslations(), 100);
        }
      });
    } else {
      // No userId detected — this is a fresh/guest session
      // Clear any stale data and show profile page
      resetProfileFormState();
      document.querySelector('.bottom-nav').style.display = 'none';
      showPage('profile');
    }

    
  });
  // ========== XARITA (LEAFLET) GEOLOKATSIYA ==========
  let mapInstance = null;
  let mapMarker = null;
  let selectedLatLng = null;
  let selectedLocationName = '';

  function openMapPicker() {
    const modal = document.getElementById('map-picker-modal');
    if (!modal) return;
    modal.style.display = 'flex';

    // Leaflet yuklanganmi?
    if (typeof L === 'undefined') {
      setTimeout(openMapPicker, 300);
      return;
    }

    // Xaritani bir marta yaratish
    if (!mapInstance) {
      initLeafletMap();
    } else {
      mapInstance.invalidateSize();
    }

    // Agar oldin tanlangan joy bo'lsa, markerni ko'rsat
    if (selectedLatLng) {
      mapInstance.setView(selectedLatLng, 13);
      showMapResult(selectedLocationName || tr('map_searching'));
    }
  }

  function initLeafletMap() {
    // Default: O'zbekiston markaziga
    const defaultCenter = [41.2995, 69.2401];
    const defaultZoom = 6;

    mapInstance = L.map('map-container', {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: true,
      attributionControl: true
    });

    // CartoDB Voyager — zamonaviy, chiroyli, bepul xarita
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://openstreetmap.org/copyright">OSM</a>'
    }).addTo(mapInstance);

    // Xaritaga bosish orqali joy tanlash
    mapInstance.on('click', function(e) {
      const { lat, lng } = e.latlng;
      placeMapMarker(lat, lng);
      reverseGeocode(lat, lng);
    });

    // Hint yangilash
    const hint = document.getElementById('map-hint');
    if (hint) hint.textContent = tr('map_tap_hint');
  }

  function placeMapMarker(lat, lng) {
    selectedLatLng = [lat, lng];

    // Eski markerni o'chirish
    if (mapMarker) {
      mapInstance.removeLayer(mapMarker);
    }

    // Custom pulse marker
    const icon = L.divIcon({
      className: '',
      html: '<div class="map-pin-pulse"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    mapMarker = L.marker([lat, lng], { icon }).addTo(mapInstance);
    mapInstance.panTo([lat, lng]);

    // Tasdiqlash tugmasini faollashtirish
    const confirmBtn = document.getElementById('map-confirm-btn');
    if (confirmBtn) confirmBtn.disabled = true; // geocoding tugamaguncha

    showMapResult(tr('map_searching'));
  }

  async function reverseGeocode(lat, lng) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'uz,ru;q=0.9,en;q=0.8' }
      });
      const data = await res.json();
      const addr = data.address || {};

      /*
        Nominatim O'zbekiston uchun qaytaradigan maydonlar:
          addr.city         → yirik shahar ("Toshkent", "Samarqand"...)
          addr.town         → kichik shahar ("Chirchiq", "Angren"...)
          addr.city_district→ shahar tumani (Yunusobod, Mirzo Ulugbek...)
          addr.county       → tuman ("Qibray tumani", "Bekobod tumani"...)
          addr.suburb       → mahalla
          addr.village      → qishloq
          addr.state        → viloyat ("Toshkent viloyati", "Samarqand viloyati"...)

        QOIDALAR:
          1. Toshkent shahri ichida (addr.state === "Toshkent shahri") →
                faqat "Toshkent shahri"
          2. Toshkent viloyatida (addr.state === "Toshkent viloyati") →
                "Qibray tumani, Toshkent viloyati"
          3. Boshqa viloyat markazlarida (addr.city === viloyat nomi) →
                "Samarqand shahri, Samarqand viloyati"
          4. Boshqa shahar/tuman →
                "Marg'ilon shahri, Farg'ona viloyati"
      */

      const state    = addr.state || addr.region || '';
      const city     = addr.city || '';
      const town     = addr.town || '';
      const county   = addr.county || '';
      const village  = addr.village || '';
      const suburb   = addr.suburb || '';

      let locationName = '';

      // 1) Toshkent SHAHRI (shahar sifatida alohida viloyat)
      if (state.toLowerCase().includes('toshkent shahar') ||
          state.toLowerCase().includes('tashkent city') ||
          state.toLowerCase().includes('город ташкент') ||
          (city.toLowerCase().includes('toshkent') || city.toLowerCase().includes('tashkent'))) {
        // Faqat bitta: "Toshkent shahri"
        locationName = 'Toshkent shahri';
      }

      // 2) Toshkent VILOYATI (shahardan tashqari)
      else if (state.toLowerCase().includes('toshkent viloyati') ||
               state.toLowerCase().includes('tashkent region') ||
               state.toLowerCase().includes('ташкентская область')) {
        // Tuman + viloyat
        const district = county || town || suburb || village || '';
        if (district) {
          locationName = `${district}, Toshkent viloyati`;
        } else {
          locationName = 'Toshkent viloyati';
        }
      }

      // 3) Boshqa viloyatlardagi yirik shahar (viloyat markazi)
      //    Agar city nomi state nomi bilan mos kelsa — shahar + viloyat
      else if (city && state) {
        const cityClean  = city.replace(/(shahar[i]?|city|город)/gi, '').trim().toLowerCase();
        const stateClean = state.replace(/(viloyat[i]?|oblast|область|region)/gi, '').trim().toLowerCase();
        const isCapital  = cityClean === stateClean || state.toLowerCase().startsWith(cityClean);

        if (isCapital) {
          // Viloyat markazi: "Samarqand shahri, Samarqand viloyati"
          locationName = `${city} shahri, ${state}`;
        } else {
          // Oddiy shahar: "Marg'ilon shahri, Farg'ona viloyati"
          locationName = `${city} shahri, ${state}`;
        }
      }

      // 4) Kichik shahar (town)
      else if (town && state) {
        locationName = `${town} shahri, ${state}`;
      }

      // 5) Tuman / qishloq
      else if ((county || village) && state) {
        const place = county || village || suburb || '';
        locationName = `${place}, ${state}`;
      }

      // 6) Fallback
      else {
        locationName = state || data.display_name?.split(',').slice(0, 2).join(', ').trim() || tr('map_unknown');
      }

      // Tozalash: ketma-ket bir xil so'zlar ("Samarqand, Samarqand")
      locationName = locationName.replace(/^([^,]+),\s*\1$/i, '$1');

      selectedLocationName = locationName;
      showMapResult(locationName);

      const confirmBtn = document.getElementById('map-confirm-btn');
      if (confirmBtn) confirmBtn.disabled = false;

    } catch (e) {
      selectedLocationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      showMapResult(selectedLocationName);
      const confirmBtn = document.getElementById('map-confirm-btn');
      if (confirmBtn) confirmBtn.disabled = false;
    }
  }

  function showMapResult(text) {
    const resultEl = document.getElementById('map-result');
    const resultText = document.getElementById('map-result-text');
    if (resultEl) resultEl.style.display = 'flex';
    if (resultText) resultText.textContent = text;
  }

  function useMyLocation() {
    const btn = document.getElementById('map-gps-btn');
    const geoStatus = document.getElementById('geo-status');

    if (!navigator.geolocation) {
      showToast(tr('geo_not_supported'));
      return;
    }

    if (btn) btn.style.opacity = '0.6';
    showMapResult(tr('geo_detecting'));

    // Modal tashqaridagi status
    if (geoStatus) {
      geoStatus.style.display = 'flex';
      geoStatus.textContent = tr('geo_detecting');
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;

        // Xarita ochiq bo'lsa markerni qo'y
        if (mapInstance) {
          mapInstance.setView([lat, lng], 13);
          placeMapMarker(lat, lng);
        }

        // Reverse geocoding
        await reverseGeocode(lat, lng);

        if (btn) btn.style.opacity = '1';
        if (geoStatus) {
          geoStatus.style.display = 'flex';
          geoStatus.textContent = tr('geo_success') + ': ' + selectedLocationName;
        }
      },
      (err) => {
        if (btn) btn.style.opacity = '1';
        const msg = tr('geo_error');
        showToast(msg);
        showMapResult(msg);
        if (geoStatus) {
          geoStatus.style.display = 'flex';
          geoStatus.textContent = msg;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function confirmMapLocation() {
    if (!selectedLocationName) return;

    const cityInput = document.getElementById('inp-city');
    if (cityInput) {
      cityInput.value = selectedLocationName;
      // Suggestion boxni yashirish
      const suggestions = document.getElementById('city-suggestions');
      if (suggestions) suggestions.style.display = 'none';
    }

    // Status ko'rsatish
    const geoStatus = document.getElementById('geo-status');
    if (geoStatus) {
      geoStatus.style.display = 'flex';
      geoStatus.textContent = '📍 ' + selectedLocationName;
    }

    closeMapPicker();
    showToast('📍 ' + selectedLocationName);
  }

  function closeMapPicker(e) {
    if (e && e.target !== document.getElementById('map-picker-modal')) return;
    const modal = document.getElementById('map-picker-modal');
    if (modal) modal.style.display = 'none';
  }
// ============================================================
//  STATISTIKA — Web App ichida (app.js oxiri)
// ============================================================

function switchStatsTab(tab) {
  document.querySelectorAll('.stats-tab-btn').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.stats-panel-body').forEach(p => p.style.display = 'none');
  const tabEl = document.getElementById('stab-' + tab);
  const panelEl = document.getElementById('spanel-' + tab);
  if (tabEl) tabEl.classList.add('active');
  if (panelEl) panelEl.style.display = 'block';
}

function renderStatsRows(containerId, users, icon, label) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!users || !users.length) {
    el.innerHTML = `<div class="stats-empty">${tr('no_one_found') || 'Hozircha ma\'lumot yo\'q'} 🙈</div>`;
    return;
  }
  const medals = ['🥇','🥈','🥉'];
  el.innerHTML = users.map((u, i) => {
    const medalHtml = i < 3
      ? `<span class="stats-medal">${medals[i]}</span>`
      : `<span class="stats-medal"><span class="stats-rank-circle">${i+1}</span></span>`;
    const photo = u.photo_base64 || u.photo_file_id || '';
    const avaHtml = photo
      ? `<img class="stats-ava" src="${photo}" alt="" />`
      : `<div class="stats-ava-letter">${(u.full_name||'?')[0].toUpperCase()}</div>`;
    const meta = [u.age ? u.age + ' ' + tr('years_old') : '', u.city ? formatLocationLabel(u.city || '') : ''].filter(Boolean).join(' • ');
    return `
      <div class="stats-row">
        ${medalHtml}
        ${avaHtml}
        <div class="stats-info">
          <div class="stats-uname">${escapeHtml(u.full_name || tr('no_name') || 'Anonim')}</div>
          ${meta ? `<div class="stats-umeta">${escapeHtml(meta)}</div>` : ''}
        </div>
        <div class="stats-count-badge">${icon} ${u.count} ${label}</div>
      </div>`;
  }).join('');
}

async function openStatsModal() {
  const modal = document.getElementById('stats-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  switchStatsTab('active');

  const spinHtml = '<div class="stats-spin"><div class="spinner"></div></div>';
  ['stats-active-list','stats-likes-list','stats-superlikes-list']
    .forEach(id => { const e = document.getElementById(id); if (e) e.innerHTML = spinHtml; });

  try {
    const data = await apiPost('/api/stats/leaderboard', {});
    if (data.success) {
      renderStatsRows('stats-active-list',     data.most_active,     '🔥', tr('count_active_label') || 'ta');
      renderStatsRows('stats-likes-list',      data.top_liked,       '💙', tr('count_likes_label') || 'like');
      renderStatsRows('stats-superlikes-list', data.top_super_liked, '⭐', tr('count_super_label') || 'super like');
    } else {
      const errHtml = `<div class="stats-error">❌ ${tr('server_error') || 'Ma\'lumot yuklanmadi'}</div>`;
      ['stats-active-list','stats-likes-list','stats-superlikes-list']
        .forEach(id => { const e = document.getElementById(id); if (e) e.innerHTML = errHtml; });
    }
  } catch(e) {
    const errHtml = `<div class="stats-error">❌ ${tr('check_internet') || 'Internet aloqasini tekshiring'}</div>`;
    ['stats-active-list','stats-likes-list','stats-superlikes-list']
      .forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = errHtml; });
  }
}

function closeStatsModal(e) {
  if (e && e.target !== e.currentTarget) return;
  const modal = document.getElementById('stats-modal');
  if (modal) modal.style.display = 'none';
}
// ========== STATISTIKA MINI-PANEL ==========
let _miniStatsData = null;
let _miniStatsCurrentTab = 'active';

function updateMiniStatsLabels() {
  // TOP tugmasi yozuvi
  const toggleLabel = document.getElementById('stats-toggle-label');
  if (toggleLabel) toggleLabel.textContent = tr('top_label') || 'TOP';

  // TOP panel tugmalari labellari
  const labelMap = {
    'active':     { key: 'top_btn_active',     fallback: 'Faollar' },
    'likes':      { key: 'top_btn_likes',      fallback: 'Like TOP' },
    'superlikes': { key: 'top_btn_superlikes', fallback: 'Super TOP' },
    'champion':   { key: 'top_btn_champion',   fallback: 'Chempion' },
  };
  Object.entries(labelMap).forEach(([tab, { key, fallback }]) => {
    const btn = document.getElementById('tpbtn-' + tab);
    if (!btn) return;
    const labelEl = btn.querySelector('.top-panel-btn-label');
    if (labelEl) labelEl.textContent = tr(key) || fallback;
  });

  // Eski smtab-* lar uchun (stats modal)
  const smActive = document.getElementById('smtab-active');
  if (smActive) smActive.textContent = tr('stats_active') || '🔥 Faollar';
  const smLikes = document.getElementById('smtab-likes');
  if (smLikes) smLikes.textContent = tr('stats_likes') || '💙 Like';
  const smSuper = document.getElementById('smtab-superlikes');
  if (smSuper) smSuper.textContent = tr('stats_superlikes') || '⭐ Super';

  // Agar TOP panel ochiq bo'lsa — qayta render
  if (_miniStatsOpen && _miniStatsData) renderTopPanelTab(_topPanelTab);
}

let _miniStatsOpen = false;
let _topPanelTab = 'active';

function toggleMiniStats() {
  const panel = document.getElementById('stats-mini-panel');
  const btn = document.getElementById('stats-toggle-btn');
  if (!panel) return;
  _miniStatsOpen = !_miniStatsOpen;
  if (_miniStatsOpen) {
    panel.style.display = 'block';
    btn && btn.classList.add('is-open');
    loadMiniStats();
  } else {
    panel.style.display = 'none';
    btn && btn.classList.remove('is-open');
  }
}

function switchTopPanelTab(tab) {
  _topPanelTab = tab;
  document.querySelectorAll('.top-panel-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tpbtn-' + tab);
  if (btn) btn.classList.add('active');
  if (_miniStatsData) {
    renderTopPanelTab(tab);
  } else {
    loadMiniStats();
  }
}

async function loadMiniStats() {
  updateMiniStatsLabels();
  const body = document.getElementById('stats-mini-body');
  if (!body) return;
  body.innerHTML = '<div class="stats-mini-loading"><div class="spinner"></div></div>';
  try {
    const data = await apiPost('/api/stats/leaderboard', {});
    if (data.success) {
      _miniStatsData = data;
      renderTopPanelTab(_topPanelTab);
    } else {
      body.innerHTML = `<div class="stats-mini-empty">${tr('server_error') || 'Ma\'lumot yuklanmadi'}</div>`;
    }
  } catch(e) {
    body.innerHTML = `<div class="stats-mini-empty">${tr('check_internet') || 'Internet aloqasini tekshiring'}</div>`;
  }
}

function renderTopPanelTab(tab) {
  const body = document.getElementById('stats-mini-body');
  if (!body || !_miniStatsData) return;

  const medals = ['🥇','🥈','🥉'];

  function buildRows(users, icon, label) {
    if (!users || !users.length) return `<div class="stats-mini-empty">${tr('no_one_found') || 'Hozircha ma\'lumot yo\'q'} 🙈</div>`;
    return users.slice(0, 10).map((u, i) => {
      const rankHtml = i < 3
        ? `<span class="stats-mini-rank">${medals[i]}</span>`
        : `<span class="stats-mini-rank"><span class="stats-mini-rank-num">${i+1}</span></span>`;
      const photo = u.photo_base64 || u.photo_file_id || '';
      const avaHtml = photo
        ? `<img class="stats-mini-ava" src="${photo}" alt="" />`
        : `<div class="stats-mini-ava-letter">${(u.full_name||'?')[0].toUpperCase()}</div>`;
      const meta = [u.age ? u.age + ' ' + tr('years_old') : '', u.city ? formatLocationLabel(u.city || '') : ''].filter(Boolean).join(' • ');
      return `<div class="stats-mini-row">
        ${rankHtml}${avaHtml}
        <div class="stats-mini-info">
          <div class="stats-mini-name">${escapeHtml(u.full_name || tr('no_name') || 'Anonim')}</div>
          ${meta ? `<div class="stats-mini-meta">${escapeHtml(meta)}</div>` : ''}
        </div>
        <div class="stats-mini-badge">${icon} ${u.count} ${label}</div>
      </div>`;
    }).join('');
  }

  const configs = {
      active:    { title: `🔥 ${tr('top_btn_active') || 'Faollar'} TOP 10`,        users: _miniStatsData.most_active,     icon: '🔥', label: tr('count_active_label') || 'ta' },
      likes:     { title: `💙 ${tr('top_btn_likes') || 'Like TOP'} 10`,             users: _miniStatsData.top_liked,       icon: '💙', label: tr('count_likes_label') || 'like' },
      superlikes:{ title: `⭐ ${tr('top_btn_superlikes') || 'Super TOP'} 10`,        users: _miniStatsData.top_super_liked, icon: '⭐', label: tr('count_super_label') || 'super like' },
      champion:  { title: `🏆 ${tr('champions_title') || 'Mutloq chempion'}`,       users: _miniStatsData.top_liked,       icon: '🏆', label: tr('count_score_label') || 'ball' },
    };

  const cfg = configs[tab] || configs.active;

  // Chempion tab uchun kombinatsiyalangan hisob
  let users = cfg.users;
  if (tab === 'champion') {
    const all = {};
    (_miniStatsData.most_active || []).forEach(u => {
      all[u.telegram_id] = { ...u, score: (u.count || 0) * 1 };
    });
    (_miniStatsData.top_liked || []).forEach(u => {
      if (all[u.telegram_id]) all[u.telegram_id].score += (u.count || 0) * 2;
      else all[u.telegram_id] = { ...u, score: (u.count || 0) * 2 };
    });
    (_miniStatsData.top_super_liked || []).forEach(u => {
      if (all[u.telegram_id]) all[u.telegram_id].score += (u.count || 0) * 3;
      else all[u.telegram_id] = { ...u, score: (u.count || 0) * 3 };
    });
    users = Object.values(all).sort((a, b) => b.score - a.score).slice(0, 10).map(u => ({ ...u, count: u.score }));
  }

  body.innerHTML = `
    <div class="top-panel-section-title">${cfg.title}</div>
    ${buildRows(users, cfg.icon, cfg.label)}
  `;
}

function switchMiniStatsTab(tab) {
  switchTopPanelTab(tab);
}

function renderMiniStatsTab(tab) {
  const body = document.getElementById('stats-mini-body');
  if (!body || !_miniStatsData) return;
  let users, icon, label;
  if (tab === 'active') {
    users = _miniStatsData.most_active; icon = '🔥'; label = tr('count_active_label') || 'ta';
  } else if (tab === 'likes') {
    users = _miniStatsData.top_liked; icon = '💙'; label = tr('count_likes_label') || 'like';
  } else {
    users = _miniStatsData.top_super_liked; icon = '⭐'; label = tr('count_super_label') || 'super like';
  }
  if (!users || !users.length) {
    body.innerHTML = `<div class="stats-mini-empty">${tr('no_one_found') || 'Hozircha ma\'lumot yo\'q'} 🙈</div>`;
    return;
  }
  const medals = ['🥇','🥈','🥉'];
  body.innerHTML = users.slice(0, 10).map((u, i) => {
    const rankHtml = i < 3
      ? `<span class="stats-mini-rank">${medals[i]}</span>`
      : `<span class="stats-mini-rank"><span class="stats-mini-rank-num">${i+1}</span></span>`;
    const photo = u.photo_base64 || u.photo_file_id || '';
    const avaHtml = photo
      ? `<img class="stats-mini-ava" src="${photo}" alt="" />`
      : `<div class="stats-mini-ava-letter">${(u.full_name||'?')[0].toUpperCase()}</div>`;
    const meta = [u.age ? u.age + ' ' + tr('years_old') : '', u.city ? formatLocationLabel(u.city || '') : ''].filter(Boolean).join(' • ');
    return `<div class="stats-mini-row">
      ${rankHtml}
      ${avaHtml}
      <div class="stats-mini-info">
        <div class="stats-mini-name">${escapeHtml(u.full_name || tr('no_name') || 'Anonim')}</div>
        ${meta ? `<div class="stats-mini-meta">${escapeHtml(meta)}</div>` : ''}
      </div>
      <div class="stats-mini-badge">${icon} ${u.count} ${label}</div>
    </div>`;
  }).join('');
}

function updateProfileLangDisplay() {
  const el = document.getElementById('profile-lang-current-text');
  if (!el) return;
  const lang = currentLang || localStorage.getItem('app_language') || 'uz';
  const info = SUPPORTED_LANGUAGES[lang];
  if (info) el.textContent = info.name;
}

// Load mini stats when search page is shown
const _origShowPage = typeof showPage === 'function' ? showPage : null;
document.addEventListener('DOMContentLoaded', function() {
  // Update profile lang display on init
  updateProfileLangDisplay();
});

// ========== CHAMPIONS (Mutloq Chempion) ==========
  let _viewedTab = 'liked';

  function switchViewedTab(tab) {
    _viewedTab = tab;
    document.querySelectorAll('.viewed-tabs-row .stats-mini-tab').forEach(b => b.classList.remove('active'));
    document.getElementById('viewed-tab-' + tab)?.classList.add('active');
    renderViewed(tab);
  }

  function loadViewed() {
    renderViewed(_viewedTab);
  }

  function renderViewed(tab) {
    const body = document.getElementById('viewed-body');
    if (!body) return;

    const key = tab === 'liked' ? 'viewed_liked' : 'viewed_messaged';
    let items = [];
    try {
      const raw = localStorage.getItem(key);
      if (raw) items = JSON.parse(raw);
    } catch (e) {}

    if (!items || items.length === 0) {
      body.innerHTML = `
        <div class="empty-state" style="padding:30px 16px;">
          <div class="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
          <h3 style="font-size:16px;font-weight:800;color:var(--text-primary);">${tab === 'liked' ? tr('no_viewed_liked') : tr('no_viewed_messaged')}</h3>
          <p style="font-size:13px;color:var(--text-secondary);margin-top:6px;">${tab === 'liked' ? tr('no_viewed_liked_hint') : tr('no_viewed_messaged_hint')}</p>
        </div>`;
      return;
    }

    let html = '<div class="viewed-list">';
    items.forEach((u, i) => {
      html += `
        <div class="viewed-item" onclick="openProfileModalById(${u.id || 0})">
          <div class="viewed-rank normal" style="width:28px;height:28px;font-size:12px;">${i + 1}</div>
          <img class="viewed-photo" src="${u.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(u.name || 'user')}" alt="${u.name || ''}" />
          <div class="viewed-info">
            <div class="viewed-name">${u.name || tr('no_name')}</div>
            <div class="viewed-count">${u.age || ''} ${u.age ? tr('years_old') : ''} ${u.city ? '• ' + formatLocationLabel(u.city || '') : ''}</div>
          </div>
          <div class="viewed-actions">
            <button class="viewed-btn ${tab === 'liked' ? 'liked-btn' : ''}" onclick="event.stopPropagation();${tab === 'liked' ? 'openMessageModal(' + (u.id||0) + ')' : 'openChatRoom(' + (u.id||0) + ')'}">
              ${tab === 'liked'
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
              }
            </button>
          </div>
        </div>`;
    });
    html += '</div>';
    body.innerHTML = html;
  }

  function addToViewed(profile, type) {
    try {
      const key = type === 'liked' ? 'viewed_liked' : 'viewed_messaged';
      let items = [];
      const raw = localStorage.getItem(key);
      if (raw) items = JSON.parse(raw);
      if (!Array.isArray(items)) items = [];
      const id = profile.telegram_id || profile.id;
      items = items.filter(x => x.id !== id);
      items.unshift({
        id:      id,
        name:    profile.full_name || profile.name || profile.first_name || '',
        age:     profile.age || '',
        city:    profile.city || '',
        country: profile.country || '',
        region:  profile.region || '',
        district: profile.district || '',
        photo:   profile.photo_base64 || profile.photo_file_id || profile.photo || '',
        zodiac:  profile.zodiac || '',
        gender:  profile.gender || '',
        timestamp: Date.now()
      });
      if (items.length > 50) items = items.slice(0, 50);
      localStorage.setItem(key, JSON.stringify(items));
      // Real-time yangilash — mp-viewed-body (My Profile sahifasi)
      const mpBody = document.getElementById('mp-viewed-body');
      if (mpBody && mpBody.closest('.mp-section-body') && mpBody.closest('.mp-section-body').style.display !== 'none') {
        loadMpViewed(_currentMpViewedTab);
      }
      // Real-time yangilash — viewed-body (Champions/Ko'rilganlar sahifasi)
      const viewedBody = document.getElementById('viewed-body');
      if (viewedBody) {
        // Faqat joriy aktiv tabga mos kelsa yangilaymiz
        if ((type === 'liked' && _viewedTab === 'liked') || (type === 'messaged' && _viewedTab === 'messaged')) {
          renderViewed(_viewedTab);
        }
      }
    } catch (e) {}
  }

  // Barcha ko'rilgan anketalarni saqlash (like/o'tkazish farqi yo'q)
  function addToAllViewed(u) {
    try {
      let items = [];
      const raw = localStorage.getItem('viewed_all');
      if (raw) items = JSON.parse(raw);
      if (!Array.isArray(items)) items = [];
      const id = u.telegram_id || u.id;
      items = items.filter(x => x.id !== id);
      items.unshift({
        id:       id,
        name:     u.full_name || u.name || '',
        age:      u.age || '',
        city:     u.city || '',
        photo:    u.photo_base64 || u.photo_file_id || u.photo || '',
        zodiac:   u.zodiac || '',
        gender:   u.gender || '',
        timestamp: Date.now()
      });
      if (items.length > 25) items = items.slice(0, 25);
      localStorage.setItem('viewed_all', JSON.stringify(items));
      // Profil sahifasi ochiq bo'lsa real-time yangilash
      const body = document.getElementById('mp-viewed-body');
      if (body && body.closest('.mp-section-body') && body.closest('.mp-section-body').style.display !== 'none') {
        loadMpViewed();
      }
    } catch (e) {}
  }

  function openProfileModalById(id) {
    if (!id) return;
    try {
      let items = [];
      const raw = localStorage.getItem('viewed_all');
      if (raw) items = JSON.parse(raw);
      const u = items.find(x => x.id == id);
      if (!u) { showToast(tr('profile_loading') || 'Yuklanmoqda...'); return; }

      const modal = document.getElementById('profile-modal');
      const body  = document.getElementById('profile-modal-body');
      if (!modal || !body) return;

      const zodiacEmojis = {
        aries:'♈',taurus:'♉',gemini:'♊',cancer:'♋',leo:'♌',virgo:'♍',
        libra:'♎',scorpio:'♏',sagittarius:'♐',capricorn:'♑',aquarius:'♒',pisces:'♓'
      };
      const zodiacDisplay = u.zodiac
        ? `${zodiacEmojis[u.zodiac] || ''} ${tr(u.zodiac) || u.zodiac}`
        : '';

      const photoHtml = u.photo
        ? `<img src="${u.photo}" alt="${escapeHtml(u.name)}" style="width:100%;max-height:320px;object-fit:cover;border-radius:16px 16px 0 0;" />`
        : `<div style="width:100%;height:180px;border-radius:16px 16px 0 0;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;font-size:80px;">${u.gender==='ayol'?'👩':'👨'}</div>`;

      body.innerHTML = `
        ${photoHtml}
        <div style="padding:20px 16px 16px;">
          <div style="font-size:22px;font-weight:800;margin-bottom:6px;">
            ${escapeHtml(u.name || tr('no_name'))}${u.age ? ', ' + u.age : ''}
          </div>
          ${u.city ? `<div style="font-size:14px;color:var(--text-secondary);margin-bottom:4px;">📍 ${escapeHtml(formatLocationLabel(u.city || ''))}</div>` : ''}
          ${zodiacDisplay ? `<div style="font-size:14px;color:var(--text-secondary);">✨ ${escapeHtml(zodiacDisplay)}</div>` : ''}
        </div>`;
      modal.style.display = 'flex';
    } catch(e) {}
  }

// Patch showPage to reload mini-stats and update lang display
(function() {
  const _checkInterval = setInterval(function() {
    if (typeof showPage === 'function' && !showPage._miniPatched) {
      const _orig = showPage;
      window.showPage = function(page) {
        _orig(page);
        if (page === 'search') {
          // Faqat panel ochiq bo'lsa yuklaymiz (keraksiz CORS so'rovlarini kamaytirish)
          if (!_miniStatsData && _miniStatsOpen) loadMiniStats();
        }
        if (page === 'myprofile') {
          updateProfileLangDisplay();
        }
      };
      window.showPage._miniPatched = true;
      clearInterval(_checkInterval);
    }
  }, 200);
})();
// ========== MY PROFILE — SECTION TOGGLE ==========
function toggleMpSection(key) {
  const body = document.getElementById('mp-body-' + key);
  const chevron = document.getElementById('mp-chevron-' + key);
  if (!body) return;

  const isOpen = body.style.display !== 'none';

  if (isOpen) {
    body.style.display = 'none';
    chevron?.classList.remove('open');
  } else {
    body.style.display = 'block';
    chevron?.classList.add('open');
    // Load data when opening viewed section
    if (key === 'viewed' || key === 'goals') {
      if (typeof loadMpViewed === 'function') loadMpViewed();
    }
  }
}

// Auto-open anketa section on page load
document.addEventListener('DOMContentLoaded', function() {
  const anketaChevron = document.getElementById('mp-chevron-anketa');
  if (anketaChevron) anketaChevron.classList.add('open');
});

// ========== MY PROFILE — GOALS CONTENT ==========
async function loadMpGoals() {
  const container = document.getElementById('my-goals-content');
  if (!container) return;

  if (!userId) {
    container.innerHTML = `<p style="color:var(--text-tertiary);font-size:14px;padding:8px 0;">${tr('not_specified')}</p>`;
    return;
  }

  const user = await fetchUserProfile(userId);
  if (!user) {
    container.innerHTML = `<p style="color:var(--text-tertiary);font-size:14px;padding:8px 0;">${tr('not_specified')}</p>`;
    return;
  }

  const goals = (user.goals || []).map(g => `<span class="chip selected" style="pointer-events:none;">${tr(g) || g}</span>`).join('');
  const interests = (user.interests || []).slice(0, MAX_INTERESTS_ALLOWED).map(i => `<span class="chip selected" style="pointer-events:none;background:rgba(255,45,85,0.10);color:#FF2D55;border-color:rgba(255,45,85,0.25);">${tr(i) || i}</span>`).join('');

  container.innerHTML = `
    <div style="margin-bottom:12px;">
      <div class="section-title" style="font-size:13px;margin-bottom:6px;">${tr('goals_label')}</div>
      <div class="chips-wrap">${goals || `<span style="color:var(--text-tertiary);font-size:14px;">${tr('not_specified')}</span>`}</div>
    </div>
    <div>
      <div class="section-title" style="font-size:13px;margin-bottom:6px;">${tr('interests_label')}</div>
      <div class="chips-wrap">${interests || `<span style="color:var(--text-tertiary);font-size:14px;">${tr('not_specified')}</span>`}</div>
    </div>
  `;
}

// ========== MY PROFILE — VIEWED TABS ==========
let _currentMpViewedTab = 'liked';

function switchMpViewedTab(tab) {
  _currentMpViewedTab = tab;
  document.querySelectorAll('.mp-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('mp-viewed-tab-' + tab)?.classList.add('active');
  loadMpViewed(tab);
}

function loadMpViewed(tab) {
  tab = tab || _currentMpViewedTab || 'liked';
  _currentMpViewedTab = tab;
  const body = document.getElementById('mp-viewed-body');
  if (!body) return;

  const key = tab === 'liked' ? 'viewed_liked' : 'viewed_messaged';
  let items = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) items = JSON.parse(raw);
  } catch (e) {}

  if (!items || items.length === 0) {
    body.innerHTML = `
      <div style="padding:24px 8px;text-align:center;">
        <div style="font-size:36px;margin-bottom:10px;">${tab === 'liked' ? '💙' : '💬'}</div>
        <p style="font-size:14px;font-weight:600;color:var(--text-primary);">
          ${tab === 'liked' ? tr('no_viewed_liked') : tr('no_viewed_messaged')}
        </p>
        <p style="font-size:12px;color:var(--text-tertiary);margin-top:6px;">
          ${tab === 'liked' ? tr('no_viewed_liked_hint') : tr('no_viewed_messaged_hint')}
        </p>
      </div>`;
    return;
  }

  let html = '<div style="display:flex;flex-direction:column;gap:6px;padding:4px 0;">';
  items.slice(0, 50).forEach((u) => {
    const photoHtml = u.photo
      ? `<img src="${u.photo}" alt="" style="width:48px;height:48px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--glass-border);" />`
      : `<div style="width:48px;height:48px;border-radius:50%;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${u.gender==='ayol'?'👩':'👨'}</div>`;
    const zodiacStr = u.zodiac ? ` • ${getZodiacDisplay(u.zodiac)}` : '';
    const locationParts = u.city ? formatLocationLabel(u.city) : '';
    const meta = [u.age ? u.age + ' ' + tr('years_old') : '', locationParts].filter(Boolean).join(' • ') + zodiacStr;
    html += `
      <div onclick="openViewedProfile(${u.id},'${tab}')"
           style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;background:var(--glass-bg);border:1px solid var(--glass-border);"
           onmousedown="this.style.opacity='0.7'" onmouseup="this.style.opacity='1'"
           ontouchstart="this.style.opacity='0.7'" ontouchend="this.style.opacity='1'">
        ${photoHtml}
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(u.name || tr('no_name'))}</div>
          ${meta ? `<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(meta)}</div>` : ''}
        </div>
        <div style="font-size:18px;">${tab === 'liked' ? '💙' : '💬'}</div>
      </div>`;
  });
  html += '</div>';
  body.innerHTML = html;
}

function openViewedProfile(id, tab) {
  if (!id) return;
  const key = tab === 'liked' ? 'viewed_liked' : 'viewed_messaged';
  let items = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) items = JSON.parse(raw);
  } catch(e) {}
  const u = items.find(x => x.id == id);
  if (!u) { showToast(tr('profile_not_found')); return; }

  const modal = document.getElementById('profile-modal');
  const body  = document.getElementById('profile-modal-body');
  if (!modal || !body) return;

  const zodiacLabel = u.zodiac ? getZodiacDisplay(u.zodiac) : '';

  // Manzilni joriy tilda ko'rsatish
  const locationLabel = u.city ? formatLocationLabel(u.city) : '';

  const photoHtml = u.photo
    ? `<img src="${u.photo}" alt="" style="width:100%;max-height:300px;object-fit:cover;border-radius:16px 16px 0 0;cursor:zoom-in;" onclick="openPhotoViewer('${escapeJs(u.photo)}','${escapeJs(u.name||'')}')" />`
    : `<div style="width:100%;height:180px;border-radius:16px 16px 0 0;background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;font-size:80px;">${u.gender==='ayol'?'👩':'👨'}</div>`;

  body.innerHTML = `
    ${photoHtml}
    <div style="padding:18px 16px 20px;">
      <div style="font-size:22px;font-weight:800;margin-bottom:10px;">
        ${escapeHtml(u.name || tr('no_name'))}${u.age ? ', ' + u.age : ''}
      </div>
      ${locationLabel ? `<div style="font-size:14px;color:var(--text-secondary);margin-bottom:6px;">📍 ${escapeHtml(locationLabel)}</div>` : ''}
      ${zodiacLabel ? `<div style="font-size:14px;color:var(--text-secondary);margin-bottom:6px;">✨ ${escapeHtml(zodiacLabel)}</div>` : ''}
      <div style="margin-top:16px;display:flex;gap:8px;">
        <button onclick="sendLike(${u.id});closeProfileModal();"
          style="flex:1;padding:12px;border-radius:12px;background:var(--ios-blue);color:#fff;font-weight:700;font-size:14px;border:none;cursor:pointer;">
          💙 ${tr('like')}
        </button>
        <button onclick="openMessageModal(${u.id},'${escapeJs(u.name||'')}','${escapeJs(u.photo||'')}',true);closeProfileModal();"
          style="flex:1;padding:12px;border-radius:12px;background:var(--glass-bg-strong);color:var(--text-primary);font-weight:700;font-size:14px;border:1px solid var(--glass-border);cursor:pointer;">
          💬 ${tr('send_message_btn')}
        </button>
      </div>
    </div>`;
  modal.style.display = 'flex';
}
