import s from './PatternDivider.module.css'

export default function PatternDivider({ flip = false }) {
  return (
    <div className={[s.strip, flip ? s.flip : ''].join(' ')}>
      <div className={s.pattern} />
      <div className={s.fadeLeft} />
      <div className={s.fadeRight} />
    </div>
  )
}
