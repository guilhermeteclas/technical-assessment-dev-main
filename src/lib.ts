/**
 * OpenStreetMap / Nominatim
 *
 * https://github.com/osm-search/Nominatim
 * https://nominatim.org/release-docs/develop/
 *
 * Address: https://nominatim.openstreetmap.org/search?<params>
 * Coordinates: https://nominatim.openstreetmap.org/reverse?lat=<value>&lon=<value>&<params>
 *
 */

interface CoordinatesResponse {
  lat: number;
  lon: number;
}

interface AddressResponse {
  error: string;
  display_name: string;
  address: {
    road: string;
    suburb: string;
    city: string;
    state: string;
    country: string;
  };
}

const baseSearchURL = 'https://nominatim.openstreetmap.org/search';
const baseReverseURL = 'https://nominatim.openstreetmap.org/reverse';

// busca pelo endereço
const fetchCoordinatesFromAddress = async (
  url: string,
): Promise<CoordinatesResponse> => {
  const response = await fetch(url);
  const data = (await response.json()) as CoordinatesResponse;
  return data[0];
};

// busca pelas coordenadas
const fetchAddressFromCoordinates = async (
  url: string,
): Promise<AddressResponse> => {
  const response = await fetch(url);
  const data = (await response.json()) as AddressResponse;
  return data;
};

class GeoLib {
  public async getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lng: number },
  ): Promise<string> {
    const url = `${baseReverseURL}?lat=${coordinates[0].toString()}&lon=${coordinates[1].toString()}&format=json`;
    const data = await fetchAddressFromCoordinates(url);

    return new Promise((resolve, reject) => {
      if (!data.error) {
        resolve(
          data.address.road +
            ', ' +
            data.address.suburb +
            ', ' +
            data.address.city +
            ', ' +
            data.address.state +
            ', ' +
            data.address.country,
        );
      } else {
        reject(data.error);
      }
    });
  }

  public async getCoordinatesFromAddress(
    address: string,
  ): Promise<{ lat: number; lng: number }> {
    const url = `${baseSearchURL}?q=${address.replaceAll(' ', '%20')}&format=json`;
    const data = await fetchCoordinatesFromAddress(url);

    return new Promise((resolve, reject) => {
      if (data) {
        resolve({ lat: +data.lat, lng: +data.lon });
      } else {
        reject('Coordinates not founded.');
      }
    });
  }
}

export default new GeoLib();
