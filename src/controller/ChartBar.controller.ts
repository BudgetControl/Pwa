import ChartController from './Chart.controller';
import ChartService from "../services/chart.service";

class ChartBarController extends ChartController {

    protected dataset: any[] = [];

    /**
     * Builds a bar dataset for the chart based on the provided date range.
     * 
     * @param date - An object containing the start and end dates for the dataset.
     * @param date.start - The start date of the range.
     * @param date.end - The end date of the range.
     * @returns A promise that resolves to the ChartBarController instance.
     * 
     * This method fetches the expenses bar data by category for the given date range.
     * It processes the response to filter out elements with negative values and 
     * organizes them into the dataset by category ID.
     */
    async buildDataset(date: { start: string, end: string }): Promise<ChartBarController> {

        const chartService = new ChartService();
        await chartService
            .expensesBarByCategory([
                {
                    start: date.start,
                    end: date.end,
                },
            ])
            .then((resp) => {

                if (resp && resp.bar) {

                    resp.bar.forEach((element) => {
                        if (element.value < 0) {

                            this.dataset.push(element)

                        }
                    });

                }
            })

        return this
    }

    /**
     * Asynchronously retrieves a bar dataset.
     *
     * This method processes the internal dataset and transforms it into an array of objects
     * containing labels, colors, and values. The values are negated during the transformation.
     *
     * @returns {Promise<{ labels: string[], colors: string[], value: number }[]>} 
     *          A promise that resolves to an array of objects, each containing:
     *          - `labels`: An array of strings representing the labels.
     *          - `colors`: An array of strings representing the colors.
     *          - `value`: A number representing the value (negated).
     */
    async getDataset(): Promise<{ label: string[], color: string[], value: number, icon: string }[]> {

        const dataset: { label: string[], color: string[], value: number, icon: string }[] = []

        const element = this.dataset;
        element.forEach((el) => {

            dataset.push(
                {
                    label: el.data.slug,
                    color: el.color,
                    value: el.value,
                    icon: el.data.category.icon
                }
            )
        })

        console.debug('Bar dataset:', dataset);

        return dataset;
    }

}

export default new ChartBarController();