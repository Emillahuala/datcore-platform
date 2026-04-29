export type TipoPregunta = 'text' | 'textarea' | 'radio' | 'checkbox' | 'select'

export interface Pregunta {
  id: string
  texto: string
  tipo: TipoPregunta
  opciones?: string[]
  requerida: boolean
  ayuda?: string
}

export interface Seccion {
  id: string
  titulo: string
  descripcion?: string
  preguntas: Pregunta[]
}

export interface FormularioData {
  id: string
  titulo: string
  descripcion: string
  area: string
  status: 'pendiente' | 'en_progreso' | 'completado' | 'borrador'
  progreso: number
  secciones: Seccion[]
}

export const FORMULARIOS_MOCK: FormularioData[] = [
  {
    id: '1',
    titulo: 'Inventario de datos de personal activo',
    descripcion: 'Registro y clasificación de todos los datos personales del personal en nómina activa, según lo exige la Ley 21.719.',
    area: 'Recursos Humanos',
    status: 'pendiente',
    progreso: 0,
    secciones: [
      {
        id: 's1',
        titulo: 'Identificación del área',
        descripcion: 'Información general sobre el área y el responsable del tratamiento de datos.',
        preguntas: [
          { id: 'q1', texto: '¿Cuál es el nombre completo del área o departamento?', tipo: 'text', requerida: true, ayuda: 'Ej: Recursos Humanos, Gestión de Personas' },
          { id: 'q2', texto: '¿Quién es el responsable directo del manejo de datos en esta área?', tipo: 'text', requerida: true },
          { id: 'q3', texto: '¿El área cuenta con un registro formal de los datos que maneja?', tipo: 'radio', requerida: true, opciones: ['Sí, completamente documentado', 'Parcialmente documentado', 'No existe registro'] },
        ],
      },
      {
        id: 's2',
        titulo: 'Tipos de datos personales tratados',
        descripcion: 'Identifique qué categorías de datos personales recopila y almacena su área.',
        preguntas: [
          { id: 'q4', texto: '¿Qué tipos de datos personales maneja actualmente?', tipo: 'checkbox', requerida: true, opciones: ['Nombre y RUT', 'Dirección y datos de contacto', 'Datos bancarios', 'Datos de salud', 'Datos biométricos', 'Antecedentes laborales'], ayuda: 'Seleccione todos los que apliquen.' },
          { id: 'q5', texto: '¿Recopila datos de categorías especiales (salud, biometría, origen étnico, creencias)?', tipo: 'radio', requerida: true, opciones: ['Sí', 'No', 'No estoy seguro/a'] },
          { id: 'q6', texto: 'Si recopila datos sensibles, describa el propósito y las medidas de protección aplicadas:', tipo: 'textarea', requerida: false, ayuda: 'Explique brevemente para qué se usan y cómo se protegen.' },
        ],
      },
      {
        id: 's3',
        titulo: 'Base legal del tratamiento',
        descripcion: 'Justificación legal para el tratamiento de datos según la Ley 21.719.',
        preguntas: [
          { id: 'q7', texto: '¿Bajo qué base legal trata los datos personales?', tipo: 'radio', requerida: true, opciones: ['Consentimiento del titular', 'Relación contractual (contrato de trabajo)', 'Obligación legal', 'Interés legítimo', 'No lo tengo claro'] },
          { id: 'q8', texto: '¿Se obtiene el consentimiento por escrito de los trabajadores para el tratamiento de sus datos?', tipo: 'radio', requerida: true, opciones: ['Sí, tenemos formularios firmados', 'Sí, pero de forma verbal', 'No actualmente', 'No aplica'] },
        ],
      },
      {
        id: 's4',
        titulo: 'Almacenamiento y seguridad',
        descripcion: 'Medidas técnicas y organizacionales para proteger los datos.',
        preguntas: [
          { id: 'q9', texto: '¿Dónde se almacenan los datos del personal activo?', tipo: 'checkbox', requerida: true, opciones: ['Sistema de RRHH (software)', 'Planillas Excel / Google Sheets', 'Archivos físicos', 'Correo electrónico', 'Nube (Drive, OneDrive, etc.)', 'Otro'], ayuda: 'Seleccione todos los que apliquen.' },
          { id: 'q10', texto: '¿Se aplican controles de acceso a los sistemas que contienen estos datos?', tipo: 'radio', requerida: true, opciones: ['Sí, todos los sistemas tienen acceso controlado', 'Solo algunos sistemas', 'No existen controles de acceso formales'] },
          { id: 'q11', texto: '¿Con qué frecuencia se realizan respaldos de la información?', tipo: 'select', requerida: true, opciones: ['Diariamente', 'Semanalmente', 'Mensualmente', 'Sin frecuencia definida', 'No se realizan respaldos'] },
        ],
      },
      {
        id: 's5',
        titulo: 'Transferencia y retención',
        descripcion: 'Compartición de datos con terceros y políticas de retención.',
        preguntas: [
          { id: 'q12', texto: '¿Se comparten datos del personal con terceros (AFP, Isapre, Fonasa, otros)?', tipo: 'radio', requerida: true, opciones: ['Sí', 'No'] },
          { id: 'q13', texto: 'Si se comparten con terceros, ¿existe un acuerdo de tratamiento de datos con ellos?', tipo: 'radio', requerida: false, opciones: ['Sí, tenemos contratos/acuerdos firmados', 'No, es informal', 'No aplica'] },
          { id: 'q14', texto: '¿Cuánto tiempo se retienen los datos de personal activo una vez que dejan de ser necesarios?', tipo: 'select', requerida: true, opciones: ['Menos de 1 año', '1 a 3 años', '3 a 5 años', 'Más de 5 años', 'No existe política de retención definida'] },
          { id: 'q15', texto: 'Observaciones adicionales o contexto relevante:', tipo: 'textarea', requerida: false, ayuda: 'Cualquier información adicional que considere importante para la auditoría.' },
        ],
      },
    ],
  },
  {
    id: '2',
    titulo: 'Procesos de reclutamiento y candidatos',
    descripcion: 'Levantamiento de datos recopilados durante los procesos de selección y postulación de personal.',
    area: 'Recursos Humanos',
    status: 'en_progreso',
    progreso: 40,
    secciones: [
      {
        id: 's1',
        titulo: 'Datos recopilados de candidatos',
        descripcion: 'Información sobre los datos que se solicitan durante la postulación.',
        preguntas: [
          { id: 'q1', texto: '¿Qué datos se solicitan a los candidatos durante el proceso de selección?', tipo: 'checkbox', requerida: true, opciones: ['Nombre y RUT', 'CV y experiencia laboral', 'Referencias laborales', 'Datos de contacto', 'Evaluaciones psicológicas', 'Antecedentes comerciales', 'Exámenes preocupacionales'], ayuda: 'Seleccione todos los que apliquen.' },
          { id: 'q2', texto: '¿Se informa a los candidatos sobre el uso que se dará a sus datos?', tipo: 'radio', requerida: true, opciones: ['Sí, mediante aviso de privacidad en la postulación', 'Solo verbalmente', 'No se informa formalmente'] },
        ],
      },
      {
        id: 's2',
        titulo: 'Retención de datos de candidatos',
        descripcion: 'Políticas de conservación para candidatos no seleccionados.',
        preguntas: [
          { id: 'q3', texto: '¿Por cuánto tiempo se conservan los datos de candidatos que no fueron seleccionados?', tipo: 'select', requerida: true, opciones: ['Se eliminan inmediatamente', 'Menos de 6 meses', '6 meses a 1 año', 'Más de 1 año', 'No existe política definida'] },
          { id: 'q4', texto: '¿Se solicita consentimiento explícito para conservar los datos en una base de candidatos?', tipo: 'radio', requerida: true, opciones: ['Sí', 'No', 'No conservamos datos de no seleccionados'] },
        ],
      },
      {
        id: 's3',
        titulo: 'Plataformas y herramientas de reclutamiento',
        preguntas: [
          { id: 'q5', texto: '¿Qué plataformas utilizan para gestionar postulaciones?', tipo: 'checkbox', requerida: true, opciones: ['Portal web propio', 'LinkedIn', 'Trabajando.com / Laborum', 'Sistema ATS', 'Planillas Excel', 'Correo electrónico', 'Otra'] },
          { id: 'q6', texto: 'Describa brevemente el flujo del proceso de reclutamiento:', tipo: 'textarea', requerida: false, ayuda: 'Indique los puntos donde se recopilan datos personales.' },
        ],
      },
      {
        id: 's4',
        titulo: 'Evaluaciones y pruebas',
        preguntas: [
          { id: 'q7', texto: '¿Se realizan evaluaciones psicológicas o de personalidad a los candidatos?', tipo: 'radio', requerida: true, opciones: ['Sí, siempre', 'Solo para algunos cargos', 'No'] },
          { id: 'q8', texto: 'Si se realizan evaluaciones, ¿los resultados son almacenados? ¿Por cuánto tiempo?', tipo: 'textarea', requerida: false, ayuda: 'Indique dónde se almacenan y el período de retención.' },
        ],
      },
    ],
  },
  {
    id: '3',
    titulo: 'Datos de ex-empleados y licencias',
    descripcion: 'Mapeo de datos almacenados de colaboradores con contrato finalizado y gestión de licencias médicas.',
    area: 'Recursos Humanos',
    status: 'borrador',
    progreso: 0,
    secciones: [
      {
        id: 's1',
        titulo: 'Gestión post-desvinculación',
        descripcion: 'Datos que se mantienen tras la finalización del contrato laboral.',
        preguntas: [
          { id: 'q1', texto: '¿Qué datos se mantienen de los ex-empleados tras la finalización del contrato?', tipo: 'checkbox', requerida: true, opciones: ['Datos de contacto', 'Historial de remuneraciones', 'Documentos del contrato', 'Evaluaciones de desempeño', 'Registros de asistencia', 'Datos de salud / licencias'] },
          { id: 'q2', texto: '¿Existe una política formal de eliminación o anonimización de datos de ex-empleados?', tipo: 'radio', requerida: true, opciones: ['Sí, documentada y aplicada', 'Existe pero no se aplica sistemáticamente', 'No existe'] },
        ],
      },
      {
        id: 's2',
        titulo: 'Gestión de licencias médicas',
        descripcion: 'Almacenamiento y acceso a datos de salud de los trabajadores.',
        preguntas: [
          { id: 'q3', texto: '¿Dónde se almacenan las licencias médicas y datos de salud?', tipo: 'checkbox', requerida: true, opciones: ['Sistema de RRHH', 'Archivos físicos bajo llave', 'Correo electrónico', 'Carpeta compartida en red', 'Nube', 'Otro'] },
          { id: 'q4', texto: '¿Quién tiene acceso a los datos de salud y licencias de los trabajadores?', tipo: 'radio', requerida: true, opciones: ['Solo el equipo de RRHH', 'RRHH y jefatura directa', 'Todo el personal administrativo', 'Sin restricción de acceso'] },
          { id: 'q5', texto: '¿Se comparten datos de salud con terceros (médicos empresa, mutuales, Isapre)?', tipo: 'radio', requerida: true, opciones: ['Sí, con todos los mencionados', 'Solo con algunos', 'No se comparten'] },
        ],
      },
      {
        id: 's3',
        titulo: 'Derechos de los titulares',
        preguntas: [
          { id: 'q6', texto: '¿Existe un procedimiento para que ex-empleados ejerzan sus derechos (acceso, rectificación, eliminación)?', tipo: 'radio', requerida: true, opciones: ['Sí, tenemos un proceso formal', 'Se gestiona caso a caso sin proceso definido', 'No existe procedimiento'] },
          { id: 'q7', texto: 'Describa cómo se gestiona actualmente una solicitud de eliminación de datos de un ex-empleado:', tipo: 'textarea', requerida: false },
        ],
      },
    ],
  },
]
