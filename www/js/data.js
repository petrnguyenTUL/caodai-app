/* Cao Dai Vegetarian 365 - content data */
window.DATA = (function () {
  // Thap trai (10 vegetarian days) lunar day numbers
  var FAST_THAP = [1, 8, 14, 15, 18, 23, 24, 28, 29, 30];
  var FAST_LUC = [1, 8, 14, 15, 23, 30];

  // Daily teachings (parallel arrays per language)
  var TEACH = {
    vi: [
      'Th\u01b0\u01a1ng ng\u01b0\u1eddi nh\u01b0 th\u1ec3 th\u01b0\u01a1ng th\u00e2n.',
      '\u0102n chay l\u00e0 d\u01b0\u1ee1ng t\u00e2m, gi\u1eef l\u00f2ng thanh t\u1ecbnh.',
      'M\u1ed7i ng\u00e0y l\u00e0m m\u1ed9t vi\u1ec7c l\u00e0nh, l\u00f2ng an vui.',
      'T\u1eeb bi, b\u00e1c \u00e1i l\u00e0 g\u1ed1c c\u1ee7a \u0111\u1ea1o.',
      'Gi\u1eef gi\u1edbi, t\u1ecbnh t\u00e2m, th\u00e2n th\u1ec3 nh\u1eb9 nh\u00e0ng.',
      'L\u1eddi n\u00f3i hi\u1ec1n h\u00f2a l\u00e0 hoa c\u1ee7a t\u00e2m.',
      'Bi\u1ebft \u0111\u1ee7 l\u00e0 gi\u00e0u, bi\u1ebft d\u1eebng l\u00e0 an.',
      'S\u1ed1ng thi\u1ec7n h\u00f4m nay, an l\u1ea1c ng\u00e0y mai.',
      'T\u00e2m an th\u00ec th\u00e2n kh\u1ecfe.',
      'Khi\u00eam t\u1ed1n, h\u00f2a nh\u00e3, nh\u1eabn n\u1ea1i \u0111\u1ec3 d\u01b0\u1ee1ng \u0111\u1ee9c.',
      '\u0102n u\u1ed1ng \u0111i\u1ec1u \u0111\u1ed9 l\u00e0 thu\u1ed1c qu\u00fd nh\u1ea5t.',
      'Gieo nh\u00e2n l\u00e0nh, g\u1eb7t qu\u1ea3 ng\u1ecdt.',
      'Tha th\u1ee9 cho ng\u01b0\u1eddi l\u00e0 nh\u1eb9 g\u00e1nh cho m\u00ecnh.',
      'M\u1ed7i b\u1eefa chay l\u00e0 m\u1ed9t l\u1eddi t\u1ea1 \u01a1n \u0111\u1ea5t tr\u1eddi.',
      'Ch\u0103m c\u00e2y th\u00ec t\u01b0\u1edbi g\u1ed1c, d\u01b0\u1ee1ng ng\u01b0\u1eddi th\u00ec d\u01b0\u1ee1ng t\u00e2m.',
      'Gi\u1eef th\u00e2n trong s\u1ea1ch, gi\u1eef \u00fd hi\u1ec1n l\u00e0nh.',
      'Si\u00eang n\u0103ng tu t\u1ec9nh, b\u1ec1n l\u00f2ng tin y\u00eau.',
      'C\u1ee7a cho kh\u00f4ng b\u1eb1ng c\u00e1ch cho.',
      'B\u00ecnh an b\u1eaft \u0111\u1ea7u t\u1eeb m\u1ed9t h\u01a1i th\u1edf ch\u1eadm.',
      'S\u1ed1ng xanh, \u0103n l\u00e0nh, ngh\u0129 t\u1ed1t.'
    ],
    en: [
      'Love others as you love yourself.',
      'A vegetarian meal nourishes a peaceful heart.',
      'Do one good deed each day; the heart stays joyful.',
      'Compassion and charity are the root of faith.',
      'Keep the precepts, calm the mind, lighten the body.',
      'Gentle words are the flower of the heart.',
      'To know enough is to be rich.',
      'Live kindly today for peace tomorrow.',
      'A calm mind makes a healthy body.',
      'Humility and patience cultivate virtue.',
      'Moderation in eating is the finest medicine.',
      'Sow good seeds, reap sweet fruit.',
      'Forgiving others lightens your own load.',
      'Each plant-based meal is a thank-you to nature.',
      'Water the roots to grow the tree; nurture the heart to grow the person.',
      'Keep the body clean and the intentions kind.',
      'Practice diligently; keep faith and love steady.',
      'How you give matters more than what you give.',
      'Peace begins with one slow breath.',
      'Live green, eat clean, think well.'
    ],
    ko: [
      '\ub0a8\uc744 \ub0b4 \ubab8\ucc98\ub7fc \uc0ac\ub791\ud558\ub77c.',
      '\ucc44\uc2dd \ud55c \ub07c\ub294 \ub9c8\uc74c\uc744 \ud3c9\uc548\ud558\uac8c \ud55c\ub2e4.',
      '\ub9e4\uc77c \uc120\ud55c \uc77c \ud558\ub098, \ub9c8\uc74c\uc774 \uae30\uc068\ub2e4.',
      '\uc790\ube44\uc640 \ubc15\uc560\uac00 \uc2e0\uc559\uc758 \ubfcc\ub9ac\uc774\ub2e4.',
      '\uacc4\uc728\uc744 \uc9c0\ud0a4\uace0 \ub9c8\uc74c\uc744 \uace0\uc694\ud788.',
      '\ubd80\ub4dc\ub7ec\uc6b4 \ub9d0\uc740 \ub9c8\uc74c\uc758 \uaf43\uc774\ub2e4.',
      '\uc871\ud568\uc744 \uc544\ub294 \uac83\uc774 \ubd80\uc790\ub2e4.',
      '\uc624\ub298 \uc120\ud558\uac8c \uc0b4\uba74 \ub0b4\uc77c \ud3c9\uc548\ud558\ub2e4.',
      '\ub9c8\uc74c\uc774 \ud3b8\uc548\ud558\uba74 \ubab8\uc774 \uac74\uac15\ud558\ub2e4.',
      '\uaca9\uc18c\uc640 \uc778\ub0b4\ub85c \ub355\uc744 \uae30\ub978\ub2e4.',
      '\uc808\uc81c\ub41c \uc2dd\uc0ac\uac00 \ucd5c\uace0\uc758 \uc57d\uc774\ub2e4.',
      '\uc120\ud55c \uc528\uc557\uc744 \uc2ec\uc73c\uba74 \ub2ec\ucf64 \uc5f4\ub9e4\ub97c \uac70\ub454\ub2e4.',
      '\ub0a8\uc744 \uc6a9\uc11c\ud568\uc740 \ub0b4 \uc9d0\uc744 \ub354\ub294 \uac83.',
      '\ucc44\uc2dd \ud55c \ub07c\ub294 \uc790\uc5f0\uc5d0 \ub300\ud55c \uac10\uc0ac\ub2e4.',
      '\ubfcc\ub9ac\uc5d0 \ubb3c\uc744 \uc8fc\ub4ef \ub9c8\uc74c\uc744 \uac00\uafb8\ub77c.',
      '\ubab8\uc744 \uae68\ub057\uc774, \ub73b\uc744 \uc120\ud558\uac8c.',
      '\ubd80\uc9c0\ub7f0\ud788 \uc218\ud589\ud558\uace0 \ubbff\uc74c\uc744 \uad73\uac8c.',
      '\uc8fc\ub294 \ubc29\ubc95\uc774 \uc8fc\ub294 \uac83\ubcf4\ub2e4 \uc911\uc694\ud558\ub2e4.',
      '\ud3c9\uc548\uc740 \ub290\ub9b0 \uc228 \ud558\ub098\uc5d0\uc11c \uc2dc\uc791\ub41c\ub2e4.',
      '\uce5c\ud658\uacbd, \uac74\uac15\uc2dd, \uc88b\uc740 \uc0dd\uac01.'
    ]
  };

  // Recipe library. name in 3 langs; ingredients/steps in Vietnamese.
  // cat: nuoc|com|canh|chao|uong|mon|trang ; tags: tieuduong,huyetap,giamcan,truong
  function R(id, vi, en, ko, cat, kcal, time, ing, steps, tags) {
    return { id: id, name: { vi: vi, en: en, ko: ko }, cat: cat, kcal: kcal, time: time, ing: ing, steps: steps, tags: tags || [] };
  }
  var RECIPES = [
    R('pho','Ph\u1edf chay','Vegetarian pho','\ucc44\uc2dd \ud3ec','nuoc',420,35,['B\u00e1nh ph\u1edf','N\u1ea5m \u0111\u00f4ng c\u00f4','\u0110\u1eadu h\u0169','H\u00e0nh ng\u00f2','Qu\u1ebf, h\u1ed3i, g\u1eebng'],['N\u01b0\u1edbng g\u1eebng h\u00e0nh, n\u1ea5u n\u01b0\u1edbc d\u00f9ng v\u1edbi qu\u1ebf h\u1ed3i v\u00e0 n\u1ea5m.','Tr\u1ee5ng b\u00e1nh ph\u1edf, x\u1ebfp \u0111\u1eadu h\u0169 v\u00e0 n\u1ea5m.','Ch\u00e1n n\u01b0\u1edbc d\u00f9ng, r\u1eafc h\u00e0nh ng\u00f2.'],['truong']),
    R('bunhue','B\u00fan Hu\u1ebf chay','Hue-style noodle soup','\ud6c4\uc5d0\uc2dd \uad6d\uc218','nuoc',450,40,['B\u00fan','S\u1ea3, \u1edbt','\u0110\u1eadu h\u0169','Ch\u00e1o n\u1ea5m','M\u0103ng'],['Phi s\u1ea3 \u1edbt l\u00e0m n\u01b0\u1edbc d\u00f9ng.','Th\u00eam m\u0103ng, n\u1ea5m, \u0111\u1eadu h\u0169.','Ch\u00e1n b\u00fan, n\u00eam v\u1eeba \u0103n.'],['truong']),
    R('hutieu','H\u1ee7 ti\u1ebfu chay','Vegetarian noodle','\ucc44\uc2dd \uad6d\uc218','nuoc',410,30,['H\u1ee7 ti\u1ebfu','N\u1ea5m','C\u1ea3i th\u1ea3o','\u0110\u1eadu h\u0169'],['N\u1ea5u n\u01b0\u1edbc d\u00f9ng rau c\u1ee7.','Tr\u1ee5ng h\u1ee7 ti\u1ebfu v\u00e0 rau.','Ch\u00e1n n\u01b0\u1edbc, th\u00eam \u0111\u1eadu h\u0169.'],['truong']),
    R('miennam','Mi\u1ebfn n\u1ea5m','Glass noodle with mushroom','\ubc84\uc12f \ub2f9\uba74','nuoc',360,25,['Mi\u1ebfn','N\u1ea5m h\u01b0\u01a1ng','C\u00e0 r\u1ed1t','H\u00e0nh'],['Ng\u00e2m mi\u1ebfn cho m\u1ec1m.','X\u00e0o n\u1ea5m c\u00e0 r\u1ed1t.','Ch\u00e9 n\u01b0\u1edbc d\u00f9ng, cho mi\u1ebfn v\u00e0o.'],['giamcan']),
    R('comgaolut','C\u01a1m g\u1ea1o l\u1ee9t','Brown rice bowl','\ud604\ubbf8\ubc25','com',380,45,['G\u1ea1o l\u1ee9t','M\u00e8 rang','\u0110\u1eadu h\u0169','Rau lu\u1ed9c'],['Vo g\u1ea1o l\u1ee9t, n\u1ea5u v\u1edbi nhi\u1ec1u n\u01b0\u1edbc h\u01a1n g\u1ea1o tr\u1eafng.','D\u1ecdn k\u00e8m \u0111\u1eadu h\u0169 v\u00e0 rau lu\u1ed9c.','R\u1eafc m\u00e8 rang.'],['tieuduong','giamcan','truong']),
    R('comsen','C\u01a1m sen','Lotus seed rice','\uc5f0\uc790\ubc25','com',400,40,['G\u1ea1o','H\u1ea1t sen','N\u1ea5m','\u0110\u1eadu Hoa Lan'],['N\u1ea5u h\u1ea1t sen cho m\u1ec1m.','Tr\u1ed9n c\u01a1m v\u1edbi sen v\u00e0 n\u1ea5m.','H\u1ea5p l\u1ea1i 5 ph\u00fat.'],['caotuoi','truong']),
    R('comnam','C\u01a1m n\u1ea5m','Mushroom rice','\ubc84\uc12f\ubc25','com',390,35,['G\u1ea1o','N\u1ea5m \u0111\u00f9i g\u00e0','H\u00e0nh','Ti\u00eau'],['X\u00e0o n\u1ea5m th\u01a1m.','Tr\u1ed9n v\u00e0o c\u01a1m n\u00f3ng.','N\u00eam nh\u1eb9 ti\u00eau.'],['truong']),
    R('comrang','C\u01a1m chi\u00ean rau c\u1ee7','Veggie fried rice','\uc57c\ucc44 \ubcf6\uc74c\ubc25','com',430,20,['C\u01a1m ngu\u1ed9i','C\u00e0 r\u1ed1t','\u0110\u1eadu Hoa Lan','B\u1eafp'],['X\u00e0o rau c\u1ee7.','Cho c\u01a1m v\u00e0o \u0111\u1ea3o \u0111\u1ec1u.','N\u00eam x\u00ec d\u1ea7u.'],['truong']),
    R('canhrongbien','Canh rong bi\u1ec3n','Seaweed soup','\ubbf8\uc5ed\uad6d','canh',120,15,['Rong bi\u1ec3n','\u0110\u1eadu h\u0169 non','N\u1ea5m','H\u00e0nh'],['Ng\u00e2m rong bi\u1ec3n.','N\u1ea5u n\u01b0\u1edbc s\u00f4i, cho \u0111\u1eadu h\u0169 v\u00e0 rong.','N\u00eam nh\u1ea1t, r\u1eafc h\u00e0nh.'],['huyetap','giamcan','truong']),
    R('canhbido','Canh b\u00ed \u0111\u1ecf','Pumpkin soup','\ud638\ubc15\uad6d','canh',150,25,['B\u00ed \u0111\u1ecf','\u0110\u1eadu ph\u1ed9ng','H\u00e0nh ng\u00f2'],['G\u1ecdt b\u00ed c\u1eaft mi\u1ebfng.','N\u1ea5u m\u1ec1m v\u1edbi \u0111\u1eadu ph\u1ed9ng.','N\u00eam v\u1eeba.'],['caotuoi','truong']),
    R('canhraucu','Canh rau c\u1ee7','Mixed vegetable soup','\ubaa8\ub4344\uc57c\ucc44 \uad6d','canh',110,20,['C\u00e0 r\u1ed1t','C\u1ee7 c\u1ea3i','S\u00fap l\u01a1','N\u1ea5m'],['C\u1eaft rau c\u1ee7.','N\u1ea5u n\u01b0\u1edbc rau cho ng\u1ecdt.','N\u00eam nh\u1ea1t.'],['huyetap','giamcan','truong']),
    R('canhchua','Canh chua chay','Sour soup','\uc2dc\uc5b0 \uad6d','canh',140,25,['Th\u01a1m','C\u00e0 chua','\u0110\u1eadu b\u1eafp','Me','Gi\u00e1'],['N\u1ea5u n\u01b0\u1edbc me chua.','Cho c\u00e0 chua, th\u01a1m, \u0111\u1eadu b\u1eafp.','R\u1eafc rau th\u01a1m.'],['truong']),
    R('chaoyenmach','Ch\u00e1o y\u1ebfn m\u1ea1ch','Oatmeal porridge','\uc624\ud2b8\ubc00 \uc8fd','chao',250,15,['Y\u1ebfn m\u1ea1ch','S\u1eefa h\u1ea1t','Chu\u1ed1i'],['N\u1ea5u y\u1ebfn m\u1ea1ch v\u1edbi s\u1eefa h\u1ea1t.','Th\u00eam chu\u1ed1i c\u1eaft l\u00e1t.','D\u00f9ng n\u00f3ng.'],['tieuduong','giamcan','caotuoi']),
    R('chaohatsen','Ch\u00e1o h\u1ea1t sen','Lotus seed porridge','\uc5f0\uc790\uc8fd','chao',280,40,['G\u1ea1o','H\u1ea1t sen','\u0110\u01b0\u1eddng ph\u00e8n'],['N\u1ea5u sen v\u1edbi g\u1ea1o cho nh\u1eeb.','Th\u00eam \u0111\u01b0\u1eddng ph\u00e8n.','D\u00f9ng \u1ea5m.'],['caotuoi']),
    R('chaodauxanh','Ch\u00e1o \u0111\u1eadu xanh','Mung bean porridge','\ub179\ub450 \uc8fd','chao',270,35,['G\u1ea1o','\u0110\u1eadu xanh','H\u00e0nh'],['N\u1ea5u \u0111\u1eadu xanh v\u1edbi g\u1ea1o.','N\u1ea5u nh\u1eeb m\u1ecbn.','N\u00eam nh\u1ea1t.'],['truong']),
    R('suabaunh','S\u1eefa \u0111\u1eadu n\u00e0nh','Soy milk','\ub450\uc720','uong',150,20,['\u0110\u1eadu n\u00e0nh','L\u00e1 d\u1ee9a','\u0110\u01b0\u1eddng'],['Ng\u00e2m \u0111\u1eadu, xay v\u00e0 l\u1ecdc.','N\u1ea5u v\u1edbi l\u00e1 d\u1ee9a.','\u0110\u1ec3 ngu\u1ed9i, th\u00eam \u0111\u01b0\u1eddng v\u1eeba.'],['truong']),
    R('suahat','S\u1eefa h\u1ea1t','Mixed nut milk','\uacac\uacfc\ub958 \uc74c\ub8cc','uong',180,25,['H\u1ea1t \u00f3c ch\u00f3','H\u1ea1nh nh\u00e2n','M\u00e8 \u0111en'],['Ng\u00e2m h\u1ea1t qua \u0111\u00eam.','Xay v\u1edbi n\u01b0\u1edbc \u1ea5m, l\u1ecdc m\u1ecbn.','D\u00f9ng \u1ea5m.'],['tieuduong','huyetap','caotuoi']),
    R('tragaolut','Tr\u00e0 g\u1ea1o l\u1ee9t','Brown rice tea','\ud604\ubbf8\ucc28','uong',40,15,['G\u1ea1o l\u1ee9t rang','N\u01b0\u1edbc s\u00f4i'],['Rang g\u1ea1o l\u1ee9t th\u01a1m.','H\u00e3m v\u1edbi n\u01b0\u1edbc s\u00f4i 10 ph\u00fat.','U\u1ed1ng thay n\u01b0\u1edbc.'],['tieuduong','huyetap','giamcan']),
    R('sinhto','Sinh t\u1ed1 tr\u00e1i c\u00e2y','Fruit smoothie','\uacfc\uc77c \uc2a4\ubb34\ub514','uong',160,10,['Chu\u1ed1i','Xo\u00e0i','S\u1eefa h\u1ea1t','\u0110\u00e1'],['Cho t\u1ea5t c\u1ea3 v\u00e0o m\u00e1y xay.','Xay nhuy\u1ec5n.','D\u00f9ng ngay.'],['caotuoi']),
    R('dauhuhap','\u0110\u1eadu h\u0169 h\u1ea5p','Steamed tofu','\ub450\ubd80 \ucc1c','mon',180,20,['\u0110\u1eadu h\u0169','N\u1ea5m','H\u00e0nh','X\u00ec d\u1ea7u'],['X\u1ebfp \u0111\u1eadu h\u0169 v\u00e0 n\u1ea5m.','H\u1ea5p 12 ph\u00fat.','R\u01b0\u1edbi x\u00ec d\u1ea7u, r\u1eafc h\u00e0nh.'],['tieuduong','giamcan','truong']),
    R('rauluoc','Rau lu\u1ed9c','Boiled greens','\uc0b6\uc740 \ucc44\uc18c','mon',60,10,['Rau c\u1ea3i','M\u01b0\u1edbp','\u0110\u1eadu b\u1eafp'],['\u0110un n\u01b0\u1edbc s\u00f4i.','Lu\u1ed9c rau v\u1eeba ch\u00edn.','Ch\u1ea5m x\u00ec d\u1ea7u.'],['huyetap','giamcan','caotuoi','truong']),
    R('dauhuxao','\u0110\u1eadu h\u0169 x\u00e0o n\u1ea5m','Stir-fried tofu & mushroom','\ub450\ubd80 \ubcf6\uc74c','mon',220,20,['\u0110\u1eadu h\u0169','N\u1ea5m','\u1edbt chu\u00f4ng','H\u00e0nh t\u00e2y'],['Chi\u00ean s\u01a1 \u0111\u1eadu h\u0169.','X\u00e0o n\u1ea5m v\u00e0 \u1edbt chu\u00f4ng.','N\u00eam v\u1eeba, \u0111\u1ea3o \u0111\u1ec1u.'],['truong']),
    R('salad','Salad rau xanh','Green salad','\uadf8\ub9b0 \uc0d0\ub7ec\ub4dc','mon',120,10,['X\u00e0 l\u00e1ch','C\u00e0 chua','D\u01b0a leo','S\u1ed1t m\u00e8'],['R\u1eeda rau, c\u1eaft mi\u1ebfng.','Tr\u1ed9n v\u1edbi s\u1ed1t m\u00e8.','D\u00f9ng ngay.'],['tieuduong','huyetap','giamcan']),
    R('goicuon','G\u1ecfi cu\u1ed1n chay','Veggie spring roll','\uc6d4\ub0a8\uc30c','mon',160,20,['B\u00e1nh tr\u00e1ng','B\u00fan','Rau th\u01a1m','\u0110\u1eadu h\u0169'],['Tr\u1ee5ng b\u00fan.','Cu\u1ed1n b\u00e1nh tr\u00e1ng v\u1edbi rau v\u00e0 \u0111\u1eadu h\u0169.','Ch\u1ea5m t\u01b0\u01a1ng.'],['giamcan','truong']),
    R('supbido','S\u00fap b\u00ed \u0111\u1ecf','Pumpkin cream soup','\ud638\ubc15 \uc218\ud504','canh',180,30,['B\u00ed \u0111\u1ecf','S\u1eefa h\u1ea1t','H\u00e0nh t\u00e2y'],['N\u1ea5u b\u00ed m\u1ec1m.','Xay nhuy\u1ec5n v\u1edbi s\u1eefa h\u1ea1t.','N\u1ea5u l\u1ea1i, n\u00eam v\u1eeba.'],['caotuoi','truong']),
    R('chethapcam','Ch\u00e8 th\u1eadp c\u1ea9m','Mixed sweet soup','\ubaa8\ub4344 \ub2e8\ud314','trang',220,30,['\u0110\u1eadu \u0111\u1ecf','\u0110\u1eadu xanh','B\u1ed9t b\u00e1ng','N\u01b0\u1edbc c\u1ed1t d\u1eeba'],['N\u1ea5u \u0111\u1eadu m\u1ec1m.','Th\u00eam b\u1ed9t b\u00e1ng v\u00e0 \u0111\u01b0\u1eddng.','R\u01b0\u1edbi n\u01b0\u1edbc c\u1ed1t d\u1eeba.'],['truong']),
    R('traicay','Tr\u00e1i c\u00e2y t\u01b0\u01a1i','Fresh fruit plate','\uc2e0\uc120 \uacfc\uc77c','trang',90,5,['Cam','T\u00e1o','Chu\u1ed1i','Thanh long'],['R\u1eeda v\u00e0 g\u1ecdt tr\u00e1i c\u00e2y.','C\u1eaft mi\u1ebfng v\u1eeba \u0103n.','D\u00f9ng tr\u00e1ng mi\u1ec7ng.'],['tieuduong','huyetap','giamcan','caotuoi','truong']),
    R('khoaitay','Khoai t\u00e2y h\u1ea7m','Potato stew','\uac10\uc790 \uc870\ub9bc','mon',260,35,['Khoai t\u00e2y','C\u00e0 r\u1ed1t','N\u1ea5m','N\u01b0\u1edbc d\u1eeba'],['C\u1eaft khoai c\u00e0 r\u1ed1t.','H\u1ea7m v\u1edbi n\u01b0\u1edbc d\u1eeba.','N\u00eam v\u1eeba.'],['caotuoi','truong']),
    R('canhcai','Canh c\u1ea3i n\u1ea5m','Bok choy mushroom soup','\uccad\uacbd\ucc44 \uad6d','canh',90,15,['C\u1ea3i xanh','N\u1ea5m','G\u1eebng'],['\u0110un n\u01b0\u1edbc g\u1eebng.','Cho n\u1ea5m r\u1ed3i c\u1ea3i.','N\u00eam nh\u1ea1t.'],['huyetap','giamcan','truong']),
    R('bundau','B\u00fan \u0111\u1eadu','Noodle with tofu','\ub450\ubd80 \uad6d\uc218','com',360,20,['B\u00fan','\u0110\u1eadu h\u0169 chi\u00ean','Rau th\u01a1m','M\u1eafm chay'],['Chi\u00ean \u0111\u1eadu h\u0169.','D\u1ecdn b\u00fan v\u1edbi rau.','Ch\u1ea5m m\u1eafm chay.'],['truong']),
    R('xoixanh','X\u00f4i \u0111\u1eadu xanh','Mung bean sticky rice','\ub179\ub450 \ucc1c\ubc25','com',420,45,['N\u1ebfp','\u0110\u1eadu xanh','M\u00e8','D\u1eeba n\u1ea1o'],['Ng\u00e2m n\u1ebfp v\u00e0 \u0111\u1eadu.','H\u1ea5p ch\u00edn.','R\u1eafc m\u00e8 v\u00e0 d\u1eeba.'],['caotuoi']),
    R('canhkho','Canh kh\u1ed5 qua','Bitter melon soup','\uc5ec\uc8fc \uad6d','canh',80,20,['Kh\u1ed5 qua','\u0110\u1eadu h\u0169','N\u1ea5m m\u00e8o'],['Nh\u1ed3i \u0111\u1eadu h\u0169 v\u00e0o kh\u1ed5 qua.','N\u1ea5u canh nh\u1eb9.','N\u00eam v\u1eeba.'],['tieuduong','huyetap']),
    R('raucau','Rau c\u00e2u d\u1eeba','Coconut jelly','\ucf54\ucf54\ub11b \uc820\ub9ac','trang',130,30,['B\u1ed9t rau c\u00e2u','N\u01b0\u1edbc d\u1eeba','\u0110\u01b0\u1eddng'],['N\u1ea5u rau c\u00e2u v\u1edbi n\u01b0\u1edbc d\u1eeba.','\u0110\u1ed5 khu\u00f4n.','\u0110\u1ec3 l\u1ea1nh.'],['truong']),
    R('comcuon','C\u01a1m cu\u1ed9n chay','Veggie rice roll','\ucc44\uc2dd \uae40\ubc25','com',340,30,['C\u01a1m','Rong bi\u1ec3n','D\u01b0a leo','C\u00e0 r\u1ed1t','\u0110\u1eadu h\u0169'],['Tr\u1ea3i c\u01a1m l\u00ean rong bi\u1ec3n.','X\u1ebfp rau c\u1ee7.','Cu\u1ed9n ch\u1eb7t, c\u1eaft khoanh.'],['truong']),
    R('canhnam','Canh n\u1ea5m','Clear mushroom soup','\ub9d1\uc740 \ubc84\uc12f\uad6d','canh',70,15,['N\u1ea5m \u0111\u00f4ng c\u00f4','N\u1ea5m kim ch\u00e2m','H\u00e0nh ng\u00f2'],['\u0110un n\u01b0\u1edbc s\u00f4i.','Cho n\u1ea5m, n\u1ea5u 5 ph\u00fat.','R\u1eafc h\u00e0nh ng\u00f2.'],['giamcan','huyetap','truong']),
    R('daubapxao','\u0110\u1eadu b\u1eafp x\u00e0o','Sauteed okra','\uc624\ud06c\ub77c \ubcf6\uc74c','mon',110,15,['\u0110\u1eadu b\u1eafp','T\u1ecfi','D\u1ea7u \u00f4 liu'],['C\u1eaft \u0111\u1eadu b\u1eafp.','X\u00e0o nhanh v\u1edbi t\u1ecfi.','N\u00eam nh\u1ea1t.'],['tieuduong','huyetap','giamcan']),
    R('canhmuop','Canh m\u01b0\u1edbp','Luffa soup','\uc218\uc138\ubbf8 \uad6d','canh',75,15,['M\u01b0\u1edbp','\u0110\u1eadu h\u0169','L\u00e1 m\u1ed3ng t\u01a1i'],['G\u1ecdt m\u01b0\u1edbp.','N\u1ea5u v\u1edbi \u0111\u1eadu h\u0169.','N\u00eam v\u1eeba.'],['caotuoi','giamcan','truong']),
    R('banhmi','B\u00e1nh m\u00ec chay','Vegetarian banh mi','\ucc44\uc2dd \ub48d\ubbf8','mon',350,15,['B\u00e1nh m\u00ec','\u0110\u1eadu h\u0169','\u0110\u1ed3 chua','Rau th\u01a1m'],['Chi\u00ean \u0111\u1eadu h\u0169.','K\u1eb9p v\u1edbi \u0111\u1ed3 chua v\u00e0 rau.','D\u00f9ng ngay.'],['truong']),
    R('canhdausu','Canh \u0111\u1eadu s\u1eed','Chayote soup','\ucc28\uc694\ud14c \uad6d','canh',85,20,['\u0110\u1eadu s\u1eed','C\u00e0 r\u1ed1t','N\u1ea5m'],['C\u1eaft \u0111\u1eadu s\u1eed c\u00e0 r\u1ed1t.','N\u1ea5u m\u1ec1m.','N\u00eam nh\u1ea1t.'],['huyetap','giamcan','truong']),
    R('chedauden','Ch\u00e8 \u0111\u1eadu \u0111en','Black bean sweet soup','\uac80\uc740\ucf69 \ub2e8\ud314','trang',200,40,['\u0110\u1eadu \u0111en','\u0110\u01b0\u1eddng','N\u01b0\u1edbc c\u1ed1t d\u1eeba'],['N\u1ea5u \u0111\u1eadu \u0111en m\u1ec1m.','Th\u00eam \u0111\u01b0\u1eddng.','R\u01b0\u1edbi c\u1ed1t d\u1eeba.'],['truong']),
    R('bunrieu','Bún riêu chay','Veg tomato noodle soup','토마토 국수','nuoc',410,40,['Bún','Cà chua','Đậu hũ','Mắm chay','Giá'],['Phi cà chua lấy màu.','Nấu nước dùng, dầm đậu hũ.','Chán bún, thêm giá và rau.'],['truong']),
    R('bunbo','Bún bò Huế chay','Veg Hue beef noodle','비건 국수','nuoc',450,45,['Bún','Sả','Đậu hũ','Chả chay','Măng'],['Nấu nước dùng sả ớt.','Thêm chả chay và đậu hũ.','Chán bún, nêm vừa.'],['truong']),
    R('hoanhthanh','Mở hoành thánh chay','Veg wonton soup','완탄 국수','nuoc',380,35,['Vỏ hoành thánh','Nấm','Cải thảo','Mỳ trứng'],['Gói nhân nấm vào vỏ.','Nấu nước rau củ.','Cho hoành thánh và mỳ.'],['truong']),
    R('milau','Mì lẩu Thái chay','Veg tom yum noodle','똠얀 국수','nuoc',420,30,['Mì','Sả','Lá chanh','Nấm','Cà chua'],['Nấu nước chua cay với sả.','Thêm nấm, cà chua.','Trụng mì, chán nước.'],['truong']),
    R('comtam','Cơm tấm đậu hũ','Broken rice with tofu','앤두부 밥','com',430,30,['Cơm tấm','Đậu hũ','Đồ chua','Mỡ hành'],['Chiên đậu hũ vàng.','Dọn cơm kèm đồ chua.','Rưới mỡ hành.'],['truong']),
    R('banhcuon','Bánh cuốn chay','Veg rice rolls','쓌 라이스롤','com',330,40,['Bột gạo','Nấm mèo','Củ sắn','Hành'],['Tráng bánh mỏng.','Cuộn nhân nấm củ sắn.','Dọn kèm nước chấm chay.'],['truong']),
    R('xoigac','Xôi gấc','Gac sticky rice','각 찜밥','com',440,50,['Nếp','Gấc','Dừa nạo','Đường'],['Trộn nếp với gấc.','Hấp chín.','Rắc dừa và đường.'],['caotuoi']),
    R('comchaynieuhuong','Cơm niêu','Clay pot rice','뛝배기 밥','com',400,40,['Gạo','Nấm','Đậu que','Nước tương'],['Nấu cơm trong niêu.','Xào nấm đậu que.','Trộn đều, nêm tương.'],['truong']),
    R('canhcaichua','Canh cải chua','Pickled mustard soup','김치국','canh',95,20,['Cải chua','Đậu hũ','Cà chua','Hành'],['Nấu cải chua với cà chua.','Thêm đậu hũ.','Nêm vừa, rắc hành.'],['giamcan','truong']),
    R('canhkhoaimo','Canh khoai mỡ','Purple yam soup','마 국','canh',160,30,['Khoai mỡ','Nấm','Hành ngò'],['Nạo khoai mỡ.','Nấu nhừ với nấm.','Rắc hành ngò.'],['caotuoi','truong']),
    R('canhbapcaicuon','Bắp cải cuộn','Stuffed cabbage soup','양배추 쌌 국','canh',130,35,['Bắp cải','Đậu hũ','Nấm','Miến'],['Luộc lá bắp cải.','Cuộn nhân đậu hũ nấm.','Nấu canh nhẹ.'],['caotuoi','truong']),
    R('lauchay','Lẩu chay','Veg hot pot','채식 전골','canh',300,45,['Nấm các loại','Đậu hũ','Cải thảo','Bún'],['Nấu nước lẩu rau củ.','Nhúng nấm, đậu hũ, rau.','Dùng kèm bún.'],['truong']),
    R('chaobido','Cháo bí đỏ','Pumpkin porridge','호박죽','chao',240,30,['Gạo','Bí đỏ','Đậu xanh'],['Nấu gạo với bí đỏ.','Thêm đậu xanh.','Nấu nhừ mịn.'],['caotuoi','tieuduong']),
    R('chaonamrom','Cháo nấm rơm','Straw mushroom porridge','버섯 죽','chao',260,30,['Gạo','Nấm rơm','Gừng','Hành'],['Nấu cháo trắng.','Cho nấm rơm và gừng.','Nêm nhạt, rắc hành.'],['truong']),
    R('chaorau','Cháo rau củ','Veggie porridge','야채죽','chao',230,30,['Gạo','Cà rốt','Bí','Cải'],['Nấu cháo nhừ.','Thêm rau củ băm.','Nêm nhạt.'],['caotuoi','giamcan']),
    R('nuocsam','Nước sâm','Herbal cooling drink','약초 음료','uong',60,30,['Rì gây','Mía lau','Lá dứa','Đường phèn'],['Nấu các loại lá.','Lọc lấy nước.','Uống mát.'],['huyetap','giamcan']),
    R('trahoacuc','Trà hoa cúc','Chrysanthemum tea','국화차','uong',20,10,['Hoa cúc khô','Nước sôi','Mật ong'],['Hãm hoa cúc.','Để 5 phút.','Thêm mật ong.'],['huyetap','caotuoi']),
    R('nuocepcantay','Nước ép cần tây','Celery juice','셀러리 주스','uong',45,10,['Cần tây','Táo','Chanh'],['Rửa sạch rau quả.','Ép lấy nước.','Uống ngay.'],['huyetap','giamcan','tieuduong']),
    R('suagaolut','Sữa gạo lứt','Brown rice milk','현미 우유','uong',130,25,['Gạo lứt rang','Nước','Đường'],['Rang và nấu gạo lứt.','Xay và lọc.','Thêm chút đường.'],['tieuduong','giamcan']),
    R('dauhukho','Đậu hũ kho','Braised tofu','두부 조림','mon',230,25,['Đậu hũ','Nước tương','Tiêu','Hành'],['Chiên sơ đậu hũ.','Kho với nước tương.','Rắc tiêu hành.'],['truong']),
    R('namkhotieu','Nấm kho tiêu','Peppered braised mushroom','버섯 조림','mon',180,25,['Nấm đùi gà','Nước tương','Tiêu','Ớt'],['Cắt nấm.','Kho với tiêu và tương.','Đảo đến sệt.'],['truong']),
    R('chagio','Chả giò chay','Veg spring rolls','채식 춘권','mon',280,35,['Bánh tráng','Khoai môn','Nấm','Miến'],['Trộn nhân khoai nấm.','Cuốn chặt tay.','Chiên giòn.'],['truong']),
    R('mitkho','Mít kho','Braised young jackfruit','잭프루트 조림','mon',210,35,['Mít non','Sả','Nước dừa','Ớt'],['Luộc mít non.','Kho với sả và nước dừa.','Nêm đậm đà.'],['truong']),
    R('suonchay','Sườn chay chua ngọt','Sweet-sour veg ribs','새켤달 채식 갈비','mon',300,30,['Sườn chay','Dứa','Cà chua','Ớt chuông'],['Chiên sườn chay.','Nấu sốt chua ngọt.','Rưới lên sườn.'],['truong']),
    R('raucustamy','Rau củ tẩm bột','Tempura veggies','야채 튈김','mon',290,25,['Bí ngòi','Cà rốt','Khoai lang','Bột chiên'],['Cắt rau củ que.','Nhúng bột.','Chiên vàng giòn.'],['caotuoi']),
    R('chebap','Chè bắp','Sweet corn pudding','옥수수 디저트','trang',210,30,['Bắp ngọt','Bột năng','Nước cốt dừa','Đường'],['Nấu bắp với đường.','Thêm bột năng cho sệt.','Rưới cốt dừa.'],['truong']),
    R('chuoinuong','Chuối nướng','Grilled banana','구운 바나나','trang',180,20,['Chuối','Nếp','Nước cốt dừa'],['Bọc chuối trong nếp.','Nướng thơm.','Rưới cốt dừa.'],['caotuoi']),
    R('flanchay','Banh flan chay','Veg caramel custard','비건 푸딩','trang',190,40,['Sữa hạt','Bột ráu câu','Đường','Vani'],['Nấu caramel.','Trộn sữa hạt với ráu câu.','Đổ khuôn, để lạnh.'],['truong']),
    R('khoailangken','Khoai lang kén','Sweet potato balls','고구마 볼','trang',230,30,['Khoai lang','Bột nếp','Dừa','Đường'],['Hấp khoai, tán nhuyễn.','Vêr viên với bột nếp.','Chiên vàng.'],['caotuoi']),
    R('suachuahat','Sữa chua hạt','Plant yogurt bowl','식물성 요거트','trang',150,15,['Sữa chua hạt','Yến mạch','Trái cây','Hạt chía'],['Cho sữa chua ra chén.','Thêm yến mạch và trái cây.','Rắc hạt chía.'],['tieuduong','giamcan'])
  ];

  // Vegetarian food vendors / suppliers (sample directory - verify before use).
  // type: store|online|farm|market|restaurant ; certs: organic,vietgap,globalgap,haccp,iso,attp
  function V(id, name, type, region, products, certs, years, rating, transparency, hygiene, contact, note) {
    return { id: id, name: name, type: type, region: region, products: products, certs: certs, years: years, rating: rating, transparency: transparency, hygiene: hygiene, contact: contact, note: note || '' };
  }
  var VENDORS = [
    V('aulac', 'Âu Lạc Healthy Veggie', 'store', 'TP.HCM', ['Rau củ hữu cơ','Đậu hũ nhà làm','Thực phẩm chay khô'], ['organic','attp'], 7, 4.7, 88, 90, 'Q.3, TP.HCM'),
    V('chayshop', 'ChayShop Online', 'online', 'Toàn quốc', ['Thực phẩm chay đóng gói','Đồ chay giả mặn','Gia vị chay'], ['attp','haccp'], 4, 4.2, 70, 80, 'Giao hàng toàn quốc'),
    V('htxdalat', 'HTX Rau Hữu Cơ Đà Lạt', 'farm', 'Lâm Đồng', ['Rau xanh hữu cơ','Củ quả Đà Lạt'], ['organic','vietgap','globalgap'], 10, 4.8, 95, 88, 'Đà Lạt, Lâm Đồng'),
    V('benthanh', 'Quầy chay Chợ Bến Thành', 'market', 'TP.HCM', ['Rau tươi','Đậu hũ','Nấm'], ['attp'], 6, 3.9, 55, 60, 'Chợ Bến Thành, Q.1'),
    V('annhien', 'An Nhiên Foods', 'store', 'Hà Nội', ['Thực phẩm thuần chay','Ngũ cốc','Sữa hạt'], ['vietgap','attp','iso'], 5, 4.4, 78, 85, 'Cầu Giấy, Hà Nội'),
    V('hoadang', 'Nhà hàng chay Hoa Đăng', 'restaurant', 'TP.HCM', ['Suất ăn chay','Món chay chế biến sẵn'], ['attp','haccp'], 12, 4.5, 72, 88, 'Q.1, TP.HCM'),
    V('namsach', 'Trang trại Nấm Sạch Đồng Nai', 'farm', 'Đồng Nai', ['Nấm các loại','Nấm tươi'], ['vietgap','attp'], 3, 4.1, 80, 78, 'Long Khánh, Đồng Nai'),
    V('tamduc', 'Tâm Đức Organic', 'online', 'Toàn quốc', ['Hạt dinh dưỡng','Ngũ cốc hữu cơ','Trái cây sấy'], ['organic','globalgap','attp'], 6, 4.6, 90, 86, 'Giao hàng toàn quốc'),
    V('cairang', 'Sạp rau chay Cái Răng', 'market', 'Cần Thơ', ['Rau địa phương','Trái cây miệt vườn'], [], 4, 3.6, 45, 55, 'Chợ Cái Răng, Cần Thơ')
  ];

  // Cao Dai prayers (Vietnamese). Text for reference; verify with official sources.
  var PRAYERS = [
    { title: { vi: 'Kinh Ni\u1ec7m H\u01b0\u01a1ng', en: 'Incense Offering Prayer', ko: '\ud5cc\ud5a5 \uae30\ub3c4' }, body:
      '\u0110\u1ea1o g\u1ed1c b\u1edfi l\u00f2ng th\u00e0nh t\u00edn hi\u1ec7p,\nL\u00f2ng n\u01b0\u01a1ng nhang kh\u00f3i ti\u1ebfp truy\u1ec1n ra.\nM\u00f9i h\u01b0\u01a1ng l\u01b0 ng\u1ecdc bay xa,\nK\u00ednh th\u00e0nh c\u1ea7u nguy\u1ec7n Ti\u00ean gia ch\u1ee9ng l\u00f2ng.\nXin Th\u1ea7n, Th\u00e1nh ru\u1ed5i dong c\u1ee1i h\u1ea1c,\nXu\u1ed1ng ph\u00e0m tr\u1ea7n v\u1ed9i g\u00e1c xe Ti\u00ean.\nNg\u00e0y nay \u0111\u1ec7 t\u1eed kh\u1ea9n nguy\u1ec1n,\nCh\u00edn t\u1ea7ng Tr\u1eddi, \u0110\u1ea5t th\u00f4ng truy\u1ec1n ch\u1ee9ng tri.\nL\u00f2ng s\u1edf v\u1ecdng g\u1eafng ghi \u0111\u1ea3o c\u00e1o,\nNh\u1edd \u01a0n Tr\u00ean b\u1ed5 b\u00e1o ph\u01b0\u1edbc l\u00e0nh.\nNam m\u00f4 Cao \u0110\u00e0i Ti\u00ean \u00d4ng \u0110\u1ea1i B\u1ed3 T\u00e1t Ma Ha T\u00e1t.' },
    { title: { vi: 'Khai Kinh', en: 'Opening of the Scriptures', ko: '\uac1c\uacbd' }, body:
      'Bi\u1ec3n tr\u1ea7n kh\u1ed5 v\u01a1i v\u01a1i tr\u1eddi n\u01b0\u1edbc,\n\u00c1nh th\u00e1i d\u01b0\u01a1ng gi\u1ecdi tr\u01b0\u1edbc ph\u01b0\u01a1ng \u0110\u00f4ng.\nT\u1ed5 S\u01b0 Th\u00e1i Th\u01b0\u1ee3ng \u0110\u1ee9c \u00d4ng,\nRa tay d\u1eabn \u0111\u1ed9 d\u00e0y c\u00f4ng gi\u00fap \u0111\u1eddi.\nTrong Tam Gi\u00e1o c\u00f3 l\u1eddi khuy\u1ebfn d\u1ea1y,\nG\u1ed1c b\u1edfi l\u00f2ng l\u00e0m ph\u1ea3i l\u00e0m l\u00e0nh.\nTrung dung Kh\u1ed5ng Th\u00e1nh ch\u1ec9 r\u00e0nh,\nT\u1eeb bi Ph\u1eadt d\u1eb7n l\u00f2ng th\u00e0nh l\u00f2ng nh\u00e2n.\nPh\u00e9p Ti\u00ean \u0110\u1ea1o tu ch\u00e2n d\u01b0\u1ee1ng t\u00e1nh,\nM\u1ed9t c\u1ed9i sanh ba nh\u00e1nh in nhau.\nL\u00e0m ng\u01b0\u1eddi r\u00f5 th\u1ea5u l\u00fd s\u00e2u,\nS\u1eeda l\u00f2ng trong s\u1ea1ch t\u1ee5ng c\u1ea7u Th\u00e1nh Kinh.' },
    { title: { vi: 'Kinh S\u00e1m H\u1ed1i (tr\u00edch)', en: 'Repentance Prayer (excerpt)', ko: '\ucc38\ud68c \uae30\ub3c4 (\ubc1c\ucdcc)' }, body:
      'C\u00fai \u0111\u1ea7u l\u1ea1y t\u1ea1 \u01a0n Tr\u00ean,\nN\u0103m x\u01b0a tr\u00f3t l\u1ed7i nay nguy\u1ec1n \u0103n n\u0103n.\nGi\u1eef l\u00f2ng ngay th\u1eb3ng l\u00e0m l\u00e0nh,\nL\u00e1nh xa \u0111i\u1ec1u d\u1eef, t\u1eadp t\u00e0nh t\u1eeb bi.\n(Xin tham kh\u1ea3o b\u1ea3n \u0111\u1ea7y \u0111\u1ee7 t\u1eeb T\u00f2a Th\u00e1nh \u0111\u1ec3 t\u1ee5ng tr\u1ecdn b\u00e0i.)' },
    { title: { vi: 'Kinh C\u1ea7u An', en: 'Prayer for Peace', ko: '\ud3c9\uc548 \uae30\ub3c4' }, body:
      'C\u1ea7u xin \u01a0n Tr\u00ean ban b\u00ecnh an cho gia \u0111\u00ecnh v\u00e0 ch\u00fang sanh,\ngi\u1eef th\u00e2n t\u00e2m an l\u1ea1c, tai qua n\u1ea1n kh\u1ecfi.\n(Vui l\u00f2ng b\u1ed5 sung b\u1ea3n kinh ch\u00ednh th\u1ee9c c\u1ee7a H\u1ed9i Th\u00e1nh.)' },
    { title: { vi: 'Kinh C\u1ea7u Si\u00eau', en: 'Prayer for the Departed', ko: '\ucc9c\ub3c4 \uae30\ub3c4' }, body:
      'C\u1ea7u nguy\u1ec7n cho v\u00e3ng linh s\u1edbm \u0111\u01b0\u1ee3c si\u00eau th\u0103ng t\u1ecbnh \u0111\u1ed9,\ntho\u00e1t v\u00f2ng lu\u00e2n h\u1ed3i, h\u01b0\u1edfng ph\u01b0\u1edbc n\u01a1i c\u00f5i thi\u00eang.\n(Vui l\u00f2ng b\u1ed5 sung b\u1ea3n kinh ch\u00ednh th\u1ee9c c\u1ee7a H\u1ed9i Th\u00e1nh.)' },
    { title: { vi: 'Bát Nhã Tâm Kinh', en: 'Heart Sutra', ko: '반야심경' }, body:
      'Ma Ha Bát Nhã Ba La Mật Đa Tâm Kinh.\nQuán Tự Tại Bồ Tát, khi hành sâu Bát Nhã Ba La Mật Đa,\nsoi thấy năm uẩn đều không, liền qua hết thảy khổ ách.\nNày Xá Lợi Tử, sắc chẳng khác không, không chẳng khác sắc;\nsắc tức là không, không tức là sắc.\nThọ, tưởng, hành, thức cũng đều như thế.\nNày Xá Lợi Tử, tướng không của các pháp, không sanh không diệt,\nkhông dơ không sạch, không thêm không bớt.\nCho nên trong tánh không, không có sắc, thọ, tưởng, hành, thức;\nkhông có mắt, tai, mũi, lưỡi, thân, ý...\nVì không có chỗ được, Bồ Tát y theo Bát Nhã Ba La Mật Đa,\nnên tâm không ngăn ngại; vì không ngăn ngại nên không sợ hãi,\nxa hẳn điên đảo mộng tưởng, đạt tới cứu cánh Niết Bàn.\nBa đời chư Phật y theo Bát Nhã Ba La Mật Đa,\nđược đạo quả vô thượng chánh đẳng chánh giác.\nCho nên biết Bát Nhã Ba La Mật Đa là đại thần chú,\nlà đại minh chú, là vô thượng chú, là vô đẳng đẳng chú,\ntrừ được hết thảy khổ, chân thật không hư.\nLiền nói chú rằng: Yết đế, yết đế, ba la yết đế,\nba la tăng yết đế, bồ đề tát bà ha.' },
    { title: { vi: 'Kinh Phổ Môn (trích)', en: 'Universal Gate Sutra (excerpt)', ko: '관세음보문품 (발췌)' }, body:
      'Kinh Phổ Môn (Phẩm Quán Thế Âm Bồ Tát Phổ Môn - trích).\nNếu có người thọ trì danh hiệu Quán Thế Âm Bồ Tát,\ndù vào trong lửa lớn, lửa chẳng cháy được;\ndù bị nước cuốn trôi, liền được chỗ cạn.\nChúng sanh nào nhiều lòng dâm dục, sân hận, ngu si,\nthường cung kính niệm Quán Thế Âm thì liền được xa lìa.\nQuán Thế Âm Bồ Tát hay đem sức vô úy thí cho chúng sanh,\ntuỳ loại chúng sanh mà hiện thân thuyết pháp để cứu độ.\nNam mô Quán Thế Âm Bồ Tát.\n(Trích đoạn - xin tham khảo bản kinh đầy đủ từ chùa/Tòa Thánh để tụng trọn bài.)' },
    { title: { vi: 'Kinh Dược Sư (trích)', en: 'Medicine Buddha Sutra (excerpt)', ko: '약사경 (발췌)' }, body:
      'Kinh Dược Sư (trích).\nNam mô Dược Sư Lưu Ly Quang Vương Phật.\nĐức Dược Sư Lưu Ly Quang Như Lai khi còn hành đạo Bồ Tát\nđã phát mười hai đại nguyện, cứu đ�� chúng sanh khỏi bệnh khổ,\ntrường thọ an lành, thân tâm thanh tịnh, đầy đủ phước tuệ.\nAi chí tâm trì niệm danh hiệu Ngài,\ngiữ giới, làm lành, thì tiêu trừ tất bệnh, tăng trưởng căn lành.\nNam mô Dược Sư Hội Thượng Phật Bồ Tát.\n(Trích đoạn - xin tham khảo bản kinh đầy đủ để tụng trọn bài.)' },
    { title: { vi: 'Kinh Sám Hối - Hồng Danh Bửu Sám (trích)', en: 'Repentance Sutra of Buddha Names (excerpt)', ko: '홍명보참 (발췌)' }, body:
      'Kinh Sám Hối - Hồng Danh Bửu Sám (trích).\nĐệ tử chúng con từ vô thủy kiếp đến nay,\nlỡ tạo các nghiệp tội do tham, sân, si,\ntừ thân, miệng, ý mà phát sinh; nay con xin chí thành sám hối.\nNam mô Quy Y Kim Câng Thượng Sư.\nNam mô Phổ Quang Phật, Nam mô Phổ Minh Phật,\nNam mô Phổ Tịnh Phật... (cùng chư Phật mười phương).\nTội tùng tâm khởi, đem tâm sám;\ntâm được tịnh rồi, tội liền tiêu.\n(Trích đoạn - Hồng Danh Bửu Sám có 88 danh hiệu Phật; xin tham khảo bản đầy đủ.)' },
    { title: { vi: 'Kinh Địa Tạng (trích)', en: 'Ksitigarbha Sutra (excerpt)', ko: '지장경 (발췌)' }, body:
      'Kinh Địa Tạng (trích).\nNam mô Đại Nguyện Địa Tạng Vương Bồ Tát.\nĐịa Tạng Bồ Tát phát đại nguyện:\n"Địa ngục vị không, thề không thành Phật;\nchúng sanh độ tận, mới chứng Bồ Đề."\nNgười con hiếu thảo vì cha mẹ đã khuất mà trì tụng kinh này,\nlàm việc phước thiện, thì cửu được công đức cho cửu huyền thất tổ.\nNam mô U Minh Giáo Chủ Bổn Tôn Địa Tạng Vương Bồ Tát.\n(Trích đoạn - xin tham khảo bản kinh đầy đủ để tụng trọn bài.)' }
  ];

  var DEFAULT_REMINDERS = [
    { t: '05:30', icon: '\ud83c\udf05', key: 'r_morning' },
    { t: '06:30', icon: '\ud83e\udd63', key: 'r_breakfast' },
    { t: '10:00', icon: '\ud83d\udca7', key: 'r_water' },
    { t: '12:00', icon: '\ud83c\udf5a', key: 'r_lunch' },
    { t: '15:00', icon: '\ud83d\udeb6', key: 'r_walk' },
    { t: '18:00', icon: '\ud83c\udf72', key: 'r_dinner' },
    { t: '21:00', icon: '\ud83e\uddd8', key: 'r_meditate' }
  ];

  return {
    FAST_THAP: FAST_THAP, FAST_LUC: FAST_LUC,
    TEACH: TEACH, RECIPES: RECIPES, PRAYERS: PRAYERS,
    DEFAULT_REMINDERS: DEFAULT_REMINDERS,
    VENDORS: VENDORS
  };
})();
