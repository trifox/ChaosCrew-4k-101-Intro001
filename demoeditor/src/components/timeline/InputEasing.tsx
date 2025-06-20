import { SelectInput } from "react-admin"
import { EasingType } from "../util/math.easing"

export const InputEasing: React.FC<{ source: string }> = ({ source }) => {

    return (<>
        <SelectInput source={source}
            choices={[
                { id: 'clinearubic', name: 'Linear' },
                { id: 'cubic', name: 'Cubic x2' },
                { id: 'quad', name: 'Quadratic x3' },
                { id: 'quart', name: 'Quart x4' },
                { id: 'bounce', name: 'Bounce' },
                { id: 'elastic', name: 'Elastic' },
                { id: 'back', name: 'Back' },
            ] as { id: EasingType, name: string }[]}></SelectInput>
    </>
    )
}