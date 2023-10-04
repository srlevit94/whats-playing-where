import React from 'react'

const DisplayNearbyCinemas = () => {
    return (
        <div class="second-screen nearby-theaters-wrapper d-none overflow-auto ">
        <h3 class="nearby-theaters-heading text-2xl font-montserrat">Nearby Theaters</h3>
        <table class="nearby-theaters-table md:container md:mx-auto sm:container sm:mx-auto table-fixed">
          <thead class="nearby-theaters-thead">
            <tr class="nearby-theaters-tr">
              <th class="nearby-theaters-th text-lg">Serial</th>
              <th class="nearby-theaters-th text-lg">Details</th>
              <th class="nearby-theaters-th text-lg">Shows</th>
              <th class="nearby-theaters-th text-lg">Location</th>
            </tr>
          </thead>
          <tbody class="nearby-theaters-tbody">
          </tbody>
        </table>
      </div>
    );
};

export default DisplayNearbyCinemas;
