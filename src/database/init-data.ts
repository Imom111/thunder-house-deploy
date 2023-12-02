import {
  ENV_INITIAL_EMAIL,
  ENV_INITIAL_PASSWORD,
  ENV_INITIAL_USER,
} from "../config/enviroment";

export const totalFloors: number = 10;

export const equipmentInitInformation = [{equipment: 'Sofá cama',total_number_people: 2,},{equipment: 'Cama matrimonial',total_number_people: 2,},{equipment: 'Cama queensize',total_number_people: 3,},{equipment: 'Cama kingsize',total_number_people: 4,},{equipment: 'Cama individual',total_number_people: 1}];

export const supplieInitInformation = [{supplie: 'Botella de agua',},{supplie: 'Dulces de chocolate',},{supplie: 'Shampoo',},{supplie: 'Acondicionador',},{supplie: 'Cepillo de dientes'}];

export const roomStatusInitInformation = [{dirty: true,busy: false,},{dirty: true,busy: true,},{dirty: false,busy: false,},{dirty: false,busy: true}];

export const roomTypeInitInformation = [{room_type: 'Suit',price: 2000,supplies: [{supplieTotal: 20,},{supplieTotal: 50,},{supplieTotal: 5,},{supplieTotal: 5,},{supplieTotal: 10,},],equipments: [{equipmentTotal: 2,},{equipmentTotal: 1,},{equipmentTotal: 0,},{equipmentTotal: 1,},{equipmentTotal: 0,},],},{room_type: 'Jr',price: 500,supplies: [{supplieTotal: 16,},{supplieTotal: 40,},{supplieTotal: 4,},{supplieTotal: 4,},{supplieTotal: 8,},],equipments: [{equipmentTotal: 2,},{equipmentTotal: 1,},{equipmentTotal: 0,},{equipmentTotal: 0,},{equipmentTotal: 2,},],},{room_type: 'Simple',price: 250,supplies: [{supplieTotal: 6,},{supplieTotal: 15,},{supplieTotal: 2,},{supplieTotal: 2,},{supplieTotal: 3,},],equipments: [{equipmentTotal: 1,},{equipmentTotal: 0,},{equipmentTotal: 0,},{equipmentTotal: 0,},{equipmentTotal: 1,},],},{room_type: 'Doble',price: 1000,supplies: [{supplieTotal: 12,},{supplieTotal: 30,},{supplieTotal: 3,},{supplieTotal: 3,},{supplieTotal: 6,},],equipments: [{equipmentTotal: 2,},{equipmentTotal: 0,},{equipmentTotal: 0,},{equipmentTotal: 0,},{equipmentTotal: 2}]}];

export const roleInitInformation = ['Administrator','Receptionist'];

export const reservationInitInformation = [
  {
    names: ["Alejandro González Herrera","Isabella Ramos Mendoza"],
    start_date: "2023-11-06",
    end_date: "2023-11-11",
    has_breakfast: true,
    detail_reservation_room: [
      {
        total_people_booked: 4,
        positionRoom: 17,
      },
    ],
  },
  {
    names: ["Gabriel Torres Vargas","Valentina Jiménez Castro"],
    start_date: "2023-11-13",
    end_date: "2023-11-17",
    has_breakfast: false,
    detail_reservation_room: [
      {
        total_people_booked: 2,
        positionRoom: 4,
      },
      {
        total_people_booked: 3,
        positionRoom: 29,
      },
    ],
  },
  {
    names: ["Andrés Rodríguez López","Camila Pérez Ramírez"],
    start_date: "2023-11-20",
    end_date: "2023-11-25",
    has_breakfast: true,
    detail_reservation_room: [
      {
        total_people_booked: 2,
        positionRoom: 8,
      },
      {
        total_people_booked: 2,
        positionRoom: 26,
      },
      {
        total_people_booked: 2,
        positionRoom: 13,
      },
      {
        total_people_booked: 2,
        positionRoom: 31,
      },
    ],
  },
  {
    names: ["Diego Medina Silva","Sofía Cruz Martínez"],
    start_date: "2023-11-27",
    end_date: "2023-11-31",
    has_breakfast: false,
    detail_reservation_room: [
      {
        total_people_booked: 1,
        positionRoom: 2,
      },
    ],
  },
  {
    names: ["Mateo García Ortega","Victoria Flores Sánchez"],
    start_date: "2023-11-04",
    end_date: "2023-11-05",
    has_breakfast: true,
    detail_reservation_room: [
      {
        total_people_booked: 4,
        positionRoom: 19,
      },
      {
        total_people_booked: 1,
        positionRoom: 22,
      },
    ],
  }
];

// 0 - Suit
// 1 - Jr
// 2 - Simple
// 3 - Doble
export const roomsInitInformation = [
  {
    roomTypePosition: 3,
    distribution: {
      floors: [
        {
          total: 4,
          floorPosition: 0,
        },
        {
          total: 4,
          floorPosition: 1,
        },
        {
          total: 4,
          floorPosition: 2,
        },
        {
          total: 4,
          floorPosition: 3,
        },
        {
          total: 4,
          floorPosition: 4,
        },
      ],
    },
  },
  {
    roomTypePosition: 1,
    distribution: {
      floors: [
        {
          total: 2,
          floorPosition: 5,
        },
        {
          total: 2,
          floorPosition: 6,
        },
        {
          total: 2,
          floorPosition: 7,
        },
      ],
    },
  },
  {
    roomTypePosition: 2,
    distribution: {
      floors: [
        {
          total: 1,
          floorPosition: 5,
        },
        {
          total: 1,
          floorPosition: 6,
        },
        {
          total: 1,
          floorPosition: 7,
        },
      ],
    },
  },
  {
    roomTypePosition: 0,
    distribution: {
      floors: [
        {
          total: 2,
          floorPosition: 8,
        },
        {
          total: 2,
          floorPosition: 9,
        },
      ],
    },
  },
];

export const employeeInitInformaiton = [
  {
    name: 'Administrator',
    surname_father: 'Admin',
    surname_mother: 'Admin',
    phone_contact: '111-222-3333',
    email_contact: 'admin@example.com',
    birth: new Date('2000-01-01'),
    gender: 'Male',
    street_address: 'Some Street',
    city: 'Mexico',
    state_province: 'CA',
    zip_code: '94105',
    country: 'USA',
    cat_employee: {
      cat_user: {
        email: ENV_INITIAL_EMAIL,
        user_name: ENV_INITIAL_USER,
        password: ENV_INITIAL_PASSWORD,
      }
    }
  },
  {
    name: 'Subadministrator',
    surname_father: 'Subadmin',
    surname_mother: 'Subadmin',
    phone_contact: '444-555-6666',
    email_contact: 'Subadmin@example.com',
    birth: new Date('2000-01-01'),
    gender: 'Male',
    street_address: 'Other Street',
    city: 'Mexico',
    state_province: 'CA',
    zip_code: '94105',
    country: 'USA',
    cat_employee: {
      cat_user: {
        email: 'subadmin@example.com',
        user_name: 'subadmin',
        password: 'subadmin123'
      }
    }
  },
  {
    name: 'Sophie',
    surname_father: 'Williams',
    surname_mother: 'Brown',
    phone_contact: '777-888-9999',
    email_contact: 'sophie@example.com',
    birth: new Date('1998-07-03'),
    gender: 'Female',
    street_address: '555 Elm Street',
    city: 'San Francisco',
    state_province: 'CA',
    zip_code: '94105',
    country: 'USA',
    cat_employee: {
      cat_user: {
        email: 'sophie@example.com',
        user_name: 'sophie_williams',
        password: 'sophie123'
      }
    }
  },
  {
    name: 'Emma',
    surname_father: 'Johnson',
    surname_mother: 'Davis',
    phone_contact: '555-123-4567',
    email_contact: 'emma@example.com',
    birth: new Date('1990-04-15'),
    gender: 'Female',
    street_address: '789 Maple Lane',
    city: 'Los Angeles',
    state_province: 'CA',
    zip_code: '90001',
    country: 'USA',
    cat_employee: {
      cat_user: {
        email: 'emma.j@example.com',
        user_name: 'emma_90',
        password: 'emmaPass'
      }
    }
  },  
  {
    name: 'Max',
    surname_father: 'Miller',
    surname_mother: 'Jones',
    phone_contact: '999-555-8888',
    email_contact: 'max@example.com',
    birth: new Date('1985-11-22'),
    gender: 'male',
    street_address: '101 Pine Avenue',
    city: 'Chicago',
    state_province: 'IL',
    zip_code: '60601',
    country: 'USA',
    cat_employee: {
      cat_user: {
        email: 'max.m@example.com',
        user_name: 'max_jones',
        password: 'maxPass'
      }
    }
  },
];


export const clientInitInformation = [
  {
    name: 'Alice',
    surname_father: 'Johnson',
    surname_mother: 'Smith',
    phone_contact: '111-222-3333',
    email_contact: 'alice@example.com',
    birth: new Date('1992-03-14'),
    gender: 'Female',
    street_address: '456 Oak Street',
    city: 'New York',
    state_province: 'NY',
    zip_code: '10010',
    country: 'USA',
    cat_client: {
      cat_user: {
        email: 'alice@example.com',
        user_name: 'alice_j',
        password: 'alicePass123'
      }
    }
  },
  {
    name: 'Bob',
    surname_father: 'Miller',
    surname_mother: 'Brown',
    phone_contact: '444-555-6666',
    email_contact: 'bob@example.com',
    birth: new Date('1995-08-27'),
    gender: 'Male',
    street_address: '789 Pine Avenue',
    city: 'Los Angeles',
    state_province: 'CA',
    zip_code: '90012',
    country: 'USA',
    cat_client: {
      cat_user: {
        email: 'bob@example.com',
        user_name: 'bob_m',
        password: 'bobPass456'
      }
    }
  },
  {
    name: 'Eva',
    surname_father: 'Davis',
    surname_mother: 'Taylor',
    phone_contact: '777-888-9999',
    email_contact: 'eva@example.com',
    birth: new Date('1989-12-03'),
    gender: 'Female',
    street_address: '101 Elm Lane',
    city: 'San Francisco',
    state_province: 'CA',
    zip_code: '94115',
    country: 'USA',
    cat_client: {
      cat_user: {
        email: 'eva@example.com',
        user_name: 'eva_d',
        password: 'evaPass789'
      }
    }
  },
  {
    name: 'Charlie',
    surname_father: 'Smith',
    surname_mother: 'Jones',
    phone_contact: '555-123-4567',
    email_contact: 'charlie@example.com',
    birth: new Date('1993-05-20'),
    gender: 'Male',
    street_address: '555 Maple Street',
    city: 'Chicago',
    state_province: 'IL',
    zip_code: '60605',
    country: 'USA',
    cat_client: {
      cat_user: {
        email: 'charlie@example.com',
        user_name: 'charlie_s',
        password: 'charliePass101'
      }
    }
  },  
  {
    name: 'Grace',
    surname_father: 'White',
    surname_mother: 'Taylor',
    phone_contact: '999-555-8888',
    email_contact: 'grace@example.com',
    birth: new Date('1986-09-15'),
    gender: 'Female',
    street_address: '789 Oak Lane',
    city: 'Houston',
    state_province: 'TX',
    zip_code: '77002',
    country: 'USA',
    cat_client: {
      cat_user: {
        email: 'grace@example.com',
        user_name: 'grace_w',
        password: 'gracePass555'
      }
    }
  },
];
