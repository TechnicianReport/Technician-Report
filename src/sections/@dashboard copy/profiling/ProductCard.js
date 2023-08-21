import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';



// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { name, cover} = product;

  const navigate = useNavigate();

  const handlebtnClick = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {/* <StyledProductImg alt={name} src={cover} /> */}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" onClick={handlebtnClick}>
            Condemned
          </Typography>
        </Link>
      </Stack>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" onClick={handlebtnClick}>
            Memo MR
          </Typography>
        </Link>
      </Stack>
    </Card>
  );
}
