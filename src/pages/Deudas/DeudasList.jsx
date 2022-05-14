import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  CloseButton
} from '@chakra-ui/react';
import { useModal } from '@ebay/nice-modal-react';
import BreadCrumbs from '../../components/ BreadCrumbs';
import ButtonDelete from '../../components/ButtonDelete';
import ButtonEdit from '../../components/ButtonEdit';
import Table from '../../components/Table';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination/Pagination';
import MantenimientosServices from '../../services/MantenimientosServices';

function DeudasList() {
  const [deudas, setDeudas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);

  const breadCrumbs = useMemo(
    () => [
      { title: 'Inicio', url: '/' },
      { title: 'Deudas', url: '/movimientos/deudas' }
    ],
    []
  );

  const columns = useMemo(() => ['Proveedor', 'Valor', 'Acciones'], []);

  async function fetchData(pageNumber = 1) {
    try {
      setLoading(true);
      const response = await MantenimientosServices.get(pageNumber);
      if (response.status === 200) {
        setDeudas(response.data);
      }
    } catch (error) {
      setInfo({
        type: 'error',
        message: 'se ha producido un error, por favor intentelo más tarde'
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <BreadCrumbs items={breadCrumbs} />
      <div className="w-full mt-5 mx-auto bg-white shadow-lg rounded-lg">
        <div className="px-5 py-4 flex items-center">
          <h2 className="font-semibold text-gray-800 flex-grow">
            Mantenimientos
          </h2>
          <div className="flex">
            <button type="button" className="btn btn-success">
              Agregar
            </button>
          </div>
        </div>
        {info && (
          <div className="mb-2">
            <Alert status={info.type}>
              <AlertIcon />
              <Box flex="1">
                <AlertDescription display="block">
                  {info.message}
                </AlertDescription>
              </Box>
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => setInfo(null)}
              />
            </Alert>
          </div>
        )}
        <Table columns={columns} title="Deudas">
          {deudas?.data?.length &&
            deudas?.data?.map((item) => (
              <tr key={item.id}>
                <td>{item.mantenimiento.proveedor.nombres}</td>
                <td>{item.descripcion}</td>
                <td>{item.valor}</td>
                <td className="justify-center">
                  <button type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </td>
                <td className="items-center">
                  <ButtonEdit />
                  <ButtonDelete />
                </td>
              </tr>
            ))}
        </Table>
        <Pagination
          onPageChange={(pageNumber) => {
            fetchData(pageNumber);
          }}
          totalCount={mantenimientos?.total ? mantenimientos?.total : 0}
          currentPage={
            mantenimientos?.current_page ? mantenimientos?.current_page : 0
          }
          pageSize={mantenimientos?.per_page ? mantenimientos?.per_page : 0}
        />
      </div>
    </div>
  );
}

export default DeudasList;
