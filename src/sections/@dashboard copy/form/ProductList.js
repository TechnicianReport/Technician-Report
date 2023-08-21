import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  forms: PropTypes.array.isRequired,
};

export default function ProductList({ forms, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {forms.map((form) => (
        <Grid key={form.id} item xs={12} sm={6} md={3}>
          <ShopProductCard form={form} />
        </Grid>
      ))}
    </Grid>
  );
}
