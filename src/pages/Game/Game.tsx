import React, { FormEventHandler, useEffect, useState } from "react";

import "./Game.css"
import Gem from "../../components/Gem/Gem";
import Popup from "../../components/Popup/Popup";

enum Direction {
    TOP = "top",
    BOTTOM = "bottom",
    LEFT = "left",
    RIGHT = "right"

}
type Cell = {
    el: React.ReactNode
    value: number,
    index: number,

}

const Game = () => {

    const [field, setField] = useState<Cell[]>([])

    const [empty, setEmpty] = useState(-1)
    const [showPopup, setShowPopup] = useState(false)

    const [numLines, setNumLines] = useState(0)
    const [startGame, setStartGame] = useState(true)


    const [count, setCount] = useState(0)

    useEffect(
        () => {
            if (!startGame) {
                initField()

                return () => {
                    console.log(field)
                }
            }

        }, [startGame, numLines]
    )
    useEffect(
        () => {
            if (field.length > 0 && checkIsWin()) {
                setShowPopup(true)
            }
            document.body.addEventListener("keyup", handlerOnKeyUp)
            return () => {
                document.body.removeEventListener("keyup", handlerOnKeyUp)
            }

        }, [field, empty]
    )
    // useEffect(
    //         () => {
    //            console.log(field)
    //         }, [field])
    const handleChange = (event: any) => {
        setNumLines(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(1)
        if (numLines > 0) {
            console.log(2)
            setStartGame(false);
        } else {
            alert("Введите корректное количество строк!");
        }

        return
    }

    const initField = () => {
        const field = []
        let empty = -1

        // const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 13, 14, 11]
        const arr: number[] = []
        for (let i = 0; i < numLines * numLines - 1; i++) {
            arr.push(i + 1)

        }
        console.log(arr)
        for (let i = 0; i < numLines * numLines; i++) { //??
            const index = Math.floor(Math.random() * arr.length)
            // const item = arr.splice(index, 1) // item[0]
            const [item] = arr.splice(index, 1) // const = item[0]

            if (item) {
                field.push({
                    value: item,
                    index: i,
                    el: <div key={`el_${i}`}><Gem num={item} id={i} /></div>
                })

            }
            else {
                field.push({
                    value: -1,
                    index: i,
                    el: <div key={`el_${i}`}></div>
                })
                empty = i
            }
        }
        setField(field)
        setEmpty(empty)

    }
    const step = (direction: Direction) => {
        const newField = [...field]
        let newEmpty = empty
        let el1
        let el2
        let temp

        switch (direction) { //Нужно подумать над проверками
            case Direction.TOP:
                el1 = newField[newEmpty + numLines]
                el2 = newField[newEmpty]
                console.log(el1, el2)
                if (el1 && el2) {

                    el1 = newField[newEmpty + numLines]
                    el2 = newField[newEmpty]
                    temp = { ...el1 }
                    newField[newEmpty + numLines] = { ...newField[newEmpty] }
                    newField[newEmpty] = { ...temp }
                    newEmpty = newEmpty + numLines
                    // const newCount = count+1
                    // setCount(newCount)
                    setCount(count + 1)
                    console.log(count)
                }
                break;

            case Direction.BOTTOM:
                el1 = newField[newEmpty - numLines]
                el2 = newField[newEmpty]

                if (el1 && el2) {
                    temp = { ...el1 }
                    newField[newEmpty - numLines] = { ...newField[newEmpty] }
                    newField[newEmpty] = { ...temp }
                    newEmpty = newEmpty - numLines
                    setCount(count + 1)
                }
                break;

            case Direction.LEFT:
                el1 = newField[newEmpty + 1]
                el2 = newField[newEmpty]
                // console.log(newEmpty)
                if (el1 && el2 && (newEmpty + 1) % numLines !== 0) {
                    temp = { ...el1 }
                    newField[newEmpty + 1] = { ...newField[newEmpty] }
                    newField[newEmpty] = { ...temp }
                    newEmpty = newEmpty + 1
                    setCount(count + 1)
                }
                break;

            case Direction.RIGHT:
                el1 = newField[newEmpty - 1]
                el2 = newField[newEmpty]
                if (el1 && el2 && (newEmpty - 1) % numLines !== 3) {
                    temp = { ...el1 }
                    newField[newEmpty - 1] = { ...newField[newEmpty] }
                    newField[newEmpty] = { ...temp }
                    newEmpty = newEmpty - 1
                    setCount(count + 1)
                }
                break;

        }
        setField(newField)
        setEmpty(newEmpty)

    }
    const handlerOnKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case "ArrowDown":
            case "KeyS":
                step(Direction.BOTTOM)
                break;
            case "ArrowUp":
            case "KeyW":
                step(Direction.TOP)
                break;
            case "ArrowLeft":
            case "KeyA":
                step(Direction.LEFT)
                break;
            case "ArrowRight":
            case "KeyD":
                step(Direction.RIGHT)
                break;
        }
    }
    const checkIsWin = () => {
        let isWin = true
        for (let i = 0; i < 14; i++) {//Нужно заменить 14
            const el1 = field[i]
            const el2 = field[i + 1]
            if (el1 && el2 && el1.value > el2.value) {
                
                isWin = false
            }
        }

        return isWin
    }
    return (
        <main>
            <Popup isShow={startGame}>
                <>
                    <h2>Введите количество строк</h2>
                    <div>
                        <form action="" onSubmit={handleSubmit}>
                            <input type="text" value={numLines} onChange={handleChange} />
                            <input type="submit"

                            />
                        </form>

                    </div>
                </>

            </Popup>
                <section style={{ width: `${200*numLines}px`, height:`${200*numLines}px` }}>{field.map(item => item.el)}</section>
            <Popup isShow={showPopup}>
                <>
                    <h2>Вы победили</h2>
                    <div>
                        Вы победили за {count} ходов
                    </div>
                </>

            </Popup>

        </main>
    )
}
export default Game