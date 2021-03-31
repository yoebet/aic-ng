import {MatPaginatorIntl} from '@angular/material/paginator';
import {MatDateFormats} from '@angular/material/core';
import {MatSnackBarConfig} from '@angular/material/snack-bar/snack-bar-config';

const PaginatorIntl = new MatPaginatorIntl();
PaginatorIntl.itemsPerPageLabel = '每页条数';
PaginatorIntl.nextPageLabel = '';
PaginatorIntl.previousPageLabel = '';
PaginatorIntl.firstPageLabel = '';
PaginatorIntl.lastPageLabel = '';
PaginatorIntl.getRangeLabel = (page: number,
                               pageSize: number,
                               length: number): string => {
  // let to = (page + 1) * pageSize;
  // return `${page * pageSize + 1} – ${to > length ? length : to} of ${length}`;
  const pages = Math.ceil(length / pageSize);
  return `第 ${page + 1}/${pages} 页`;
};


const DATE_FORMAT = 'YYYY-MM-DD';
const MONTH_PICKER_FORMAT = 'YYYY-MM';

const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: DATE_FORMAT
  },
  display: {
    dateInput: DATE_FORMAT,
    monthYearLabel: 'YYYY-MM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMMM'
  },
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DATA_CACHE_TIME = 6 * HOUR;

const DEBUG = window?.location?.href?.indexOf('_DEBUG_') > 0 || false;

const HeaderNames = {CameraId: 'cid'};

const SnackBarDefaultConfig: MatSnackBarConfig = {
  duration: 2000,
  verticalPosition: 'top'
};

export {
  PaginatorIntl,
  DATE_FORMATS,
  DATE_FORMAT,
  MONTH_PICKER_FORMAT,
  DATA_CACHE_TIME,
  DEBUG,
  HeaderNames,
  SnackBarDefaultConfig
};
