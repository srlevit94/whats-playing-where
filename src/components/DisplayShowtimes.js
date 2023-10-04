import React from 'react'


//TODO: REFACTOR THIS TO DISPLAY AS CARDS?
const DisplayShowtimes = () => {
    return (
        <div>
        <div class="third-screen shows-wrapper d-none overflow-auto">
            <div class="shows-wrapper-inner">
                <h3 class="shows-heading text-2xl font-montserrat">Showtimes</h3>
                <table class="shows-table md:container md:mx-auto sm:container sm:mx-auto table-fixed">
                    <thead class="shows-thead">
                        <tr class="shows-tr">
                            <th class="shows-th text-lg">Serial</th>
                            <th class="shows-th text-lg">Film Name</th>
                            <th class="shows-th text-lg">Showtimes</th>
                        </tr>
                    </thead>
                    <tbody class="shows-tbody">
                    </tbody>
                </table>

                <button class="h-14 rounded-lg font-montserrat w-1/2  text-xl go-back-btn">Go Back</button>
            </div>
        </div>

        {'<!-- displays the Google Map -->'}
        <div class="forth-screen theater-map-wrapper d-none overflow-auto">
            <div class="theater-map-wrapper-inner">
                <div class="theater-map max-w-md"></div>
                <button class="h-14 rounded-lg font-montserrat w-1/2  text-xl go-back-btn">Go Back</button>
            </div>
        </div>
    </div>
    );
};

export default DisplayShowtimes;