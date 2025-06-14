export default {
  translation: {
    appName: 'Менеджер Задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный эмейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Ошибка в изменении пользователя',
          success: 'Пользователь успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
        },
        authError: 'В доступе отказано',
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        update: {
          error: 'Не удалось изменить статус',
          success: 'Статус успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
        },
        authError: 'В доступе отказано',
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        update: {
          error: 'Не удалось изменить задачу',
          success: 'Задача успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Задача успешно удалена',
        },
        authError: 'В доступе отказано',
      },
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        update: {
          error: 'Не удалось изменить метку',
          success: 'Метка успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка успешно удалена',
        },
        authError: 'В доступе отказано',
      },
      authError: 'В доступе отказано, пожалуйста войдите!',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        tasks: 'Задачи',
        labels: 'Метки',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        firstName: 'Имя',
        lastName: 'Фамилия',
        fullName: 'Полное имя',
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          user: 'Изменение пользователя',
          submit: 'Изменить',
        },
        delete: 'Удалить',
        usersList: 'Пользователи',
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        edit: {
          status: 'Изменение статуса',
          submit: 'Изменить',
        },
        delete: 'Удалить',
        new: {
          submit: 'Создать',
          creation: 'Создание статуса',
        },
        statusesList: 'Статусы',
        createStatus: 'Создать статус',
      },
      labels: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        edit: {
          label: 'Изменение метки',
          submit: 'Изменить',
        },
        delete: 'Удалить',
        new: {
          submit: 'Создать',
          creation: 'Создание метки',
        },
        labelsList: 'Метки',
        createLabel: 'Создать метку',
      },
      tasks: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        status: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        edit: 'Изменить',
        delete: 'Удалить',
        createTask: 'Создать задачу',
        tasksList: 'Задачи',
        new: 'Создание задачи',
        create: 'Создать',
        editTask: 'Изменение задачи',
        filter: {
          status: 'Статус',
          executor: 'Исполнитель',
          label: 'Метка',
          own: 'Только мои задачи',
          submit: 'Показать',
        },
      },
      welcome: {
        index: {
          hello: 'Добро пожаловать в Менеджер Задач',
          description: 'Создавайте задачи и следите за их выполнением',
          more: 'Узнать больше',
        },
      },
    },
    form: {
      name: 'Наименование',
      description: 'Описание',
      statusId: 'Статус',
      creatorId: 'Создатель',
      executorId: 'Исполнитель',
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      password: 'Пароль',
      labels: 'Метки',
    },
  },
};
