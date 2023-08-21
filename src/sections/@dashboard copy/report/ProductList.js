import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  reports: PropTypes.array.isRequired,
};

export default function ProductList({ reports, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {reports.map((report) => (
        <Grid key={report.id} item xs={12} sm={6} md={3}>
          <ShopProductCard report={report} />
        </Grid>
      ))}
    </Grid>
  );
}
