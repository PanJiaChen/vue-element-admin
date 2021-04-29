# Paginación <Badge text="v3.9.2+"/>

El componente de paginación se basa principalmente en el elemento 'el-pagination' para el empaquetado secundario, y expandió la función de desplazamiento automático (auto-scroll).

## Uso básico

```html
  <template>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList" />
  </template>

  <script>
  import Pagination from '@/components/Pagination'

  export default {
    components: { Pagination },
    data() {
      return {
        total: 0,
        listQuery: {
          page: 1,
          limit: 20
        }
      }
    },
    methods: {
      getList() {
        // Obtener datos
      }
    }
  }
  </script>
```

## Atributos

|  Atributo   | Descripción                                                                 |   Tipo    | Predeterminado  |
| :---------: | :-------------------------------------------------------------------------- | :-------: | :-------------: |
|    total    | recuento total de artículos                                                 |  Number   |        /        |
|    page     | número de página actual, soporta el modificador .sync                       |  Number   |        1        |
|    limit    | Recuento de elementos de cada página, admite el modificador .sync           |  Number   |       20        |
| page-sizes  | Opciones de conteo de artículos por página                                  | Number [] | 10, 20, 30, 50] |
|   hidden    | si ocultar                                                                  |  Boolean  |      false      |
| auto-scroll | Si se desplaza automáticamente a la parte superior después de la paginación |  Boolean  |      true       |

También se admite soporte de otros atributos del elemento `el-pagination`. Consulte la [Documentación](http://element.eleme.io/#/zh-CN/component/pagination) para obtener más detalles.

## Eventos

| Nombre del evento | Descripción                                    | Parámetros       |
| ----------------- | ---------------------------------------------- | ---------------- |
| pagination        | Se dispara cuando cambia el límite o la página | {pagina, límite} |

## Código fuente y Demo

- [Código fuente](https://github.com/adempiere/adempiere-vue/blob/master/src/components/Pagination/index.vue)

- [Demo en línea](https://adempiere.github.io/adempiere-vue/#/table/complex-table)
