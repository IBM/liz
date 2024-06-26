/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

const getOsaInterfaceName = (readChannelId) => {
    const channelSegments =
        readChannelId && typeof readChannelId === 'string'
            ? toChannelSegments(readChannelId)
            : []

    if (
        channelSegments.length === 3 &&
        channelSegments[0] === '0' &&
        channelSegments[1] === '0' &&
        channelSegments[2] === '0'
    ) {
        return 'enc0'
    } else if (
        channelSegments.length === 3 &&
        channelSegments[0] === '0' &&
        channelSegments[1] === '0'
    ) {
        return `enc${channelSegments[2].replace(/^0+/, '')}`
    } else if (channelSegments.length === 3 && channelSegments[0] === '0') {
        return `enc${channelSegments[1].replace(
            /^0+/,
            ''
        )}.${channelSegments[2].replace(/^0+/, '')}`
    } else if (channelSegments.length === 3) {
        return `enc${channelSegments[0]}.${channelSegments[1]}.${channelSegments[2]}`
    }

    return ''
}

const getRoCeInterfaceName = (fid = '', uid = '') => {
    if (uid && uid.length > 0) {
        return `eno${parseInt(uid, 16)}`
    } else if (fid && fid.length > 0) {
        return `ens${parseInt(fid, 16)}`
    }

    return ''
}

const getInterfaceName = (readChannelId = '', fid = '', uid = '') => {
    if (
        readChannelId &&
        typeof readChannelId === 'string' &&
        readChannelId.length > 0
    ) {
        return getOsaInterfaceName(readChannelId)
    } else if (uid && typeof uid === 'string' && uid.length > 0) {
        return getRoCeInterfaceName(null, uid)
    } else if (fid && typeof fid === 'string' && fid.length > 0) {
        return getRoCeInterfaceName(fid)
    } else if (
        fid &&
        uid &&
        typeof fid === 'string' &&
        typeof uid === 'string' &&
        fid.length > 0 &&
        uid.length > 0
    ) {
        return getRoCeInterfaceName(fid, uid)
    }
}

const toChannelSegmentArray = (value, sanitise = true) => {
    if (value) {
        const segments = value.split('.')
        const sanitisedSegments = []

        do {
            const currentSegment = segments.shift()

            if (
                sanitise &&
                segments.length === 0 &&
                currentSegment.length < 4
            ) {
                sanitisedSegments.push(currentSegment.padStart(4, '0'))
            } else {
                sanitisedSegments.push(currentSegment)
            }
        } while (segments.length > 0)

        return sanitisedSegments
    }
    return []
}

const toChannelSegments = (value, sanitise = true) => {
    const hasSegments =
        value.indexOf('.') >= 0 && (value.match(/\./g) || []).length === 2

    if (typeof value === 'string' && hasSegments) {
        return toChannelSegmentArray(value, sanitise)
    } else if (typeof value === 'string' && isShortFormat(value)) {
        return toChannelSegmentArray(
            sanitise ? expandShortFormat(value) : value,
            sanitise
        )
    }
    return []
}

const validateSegments = (segments) => {
    const segmentOne = segments[0]
    const segmentTwo = segments[1]
    const segmentThree = segments[2]

    return (
        isHex(segmentOne) &&
        isHex(segmentTwo) &&
        isHex(segmentThree) &&
        parseInt(segmentOne, 16) === 0x0 &&
        parseInt(segmentTwo, 16) <= 0x3 &&
        parseInt(segmentThree, 16) <= 0xffff
    )
}

const isHex = (value) => {
    const intValue = parseInt(value, 16)
    if (typeof value === 'string' && value.startsWith('0x')) {
        const stringFromIntValue = intValue.toString(16)
        const lengthWithoutPrefix = value.replace('0x', '').length
        const lengthDelta = lengthWithoutPrefix - stringFromIntValue.length

        return lengthDelta > 0
            ? `0x${intValue.toString(16).padStart(lengthWithoutPrefix, '0')}` ===
                  value.toLowerCase(value)
            : `0x${intValue.toString(16)}` === value.toLowerCase(value)
    } else if (
        typeof value === 'string' &&
        value.startsWith('0') &&
        value.length === 4
    ) {
        return (
            intValue.toString(16).padStart(4, '0') === value.toLowerCase(value)
        )
    } else if (typeof value === 'string') {
        return intValue.toString(16) === value.toLowerCase(value)
    }
    return false
}

const isShortFormat = (value) => {
    if (value && value.length <= 4 && isHex(value) && value.indexOf('.') < 0) {
        return true
    }
    return false
}

const expandShortFormat = (value) => {
    if (value && isShortFormat(value) && value.length < 4) {
        return `0.0.${value.padStart(4, '0')}`
    } else if (value && isShortFormat(value)) {
        return `0.0.${value}`
    }
    return value
}

export {
    expandShortFormat,
    getInterfaceName,
    toChannelSegments,
    validateSegments,
    isShortFormat,
    isHex,
}
